import type { DeepPartial, IsObject, Merge, RemoveIndexSignatures, SimpleMerge } from "../../../types/utils.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type BaseUser from "../documents/user.d.mts";
import type { DataModel } from "./data.d.mts";
import type Document from "./document.d.mts";
import type { DocumentModificationOptions } from "./document.d.mts";

type StaticDataModel = typeof DataModel<DataSchema, Document<DataSchema, any, any>>;

interface _InternalTypeDataModelInterface extends StaticDataModel {
  new <Schema extends DataSchema, Parent extends Document<DataSchema, any, any>, _ComputedInstance extends object>(
    ...args: ConstructorParameters<typeof DataModel>
  ): DataModel<Schema, Parent> & _ComputedInstance;
}

declare const _InternalTypeDataModelConst: _InternalTypeDataModelInterface;

// @ts-expect-error Ignore the error, this is a workaround for a dynamic class.
declare class _InternalTypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<DataSchema, any, any>,
  BaseData extends Record<string, unknown> = Record<string, never>,
  DerivedData extends Record<string, unknown> = Record<string, never>,
  // This does not work if inlined. It's weird to put it here but it works.
  _ComputedInstance extends object = Merge<RemoveIndexSignatures<BaseData>, RemoveIndexSignatures<DerivedData>>,
> extends _InternalTypeDataModelConst<Schema, Parent, _ComputedInstance> {}

// These properties are used to give a performant way of inferring types like `BaseData` and `DerivedData` types.
// This avoids checking the entire constraint `T extends TypeDataModel.Any` to infer out the types.
// To prevent adding properties that could appear at runtime they are unique symbols.
// This makes them uniterable and means that the only way to access them is to have a reference to the variables which will be impossible outside of this file.
declare const __Schema: unique symbol;
declare const __Parent: unique symbol;
declare const __BaseModel: unique symbol;
declare const __BaseData: unique symbol;
declare const __DerivedData: unique symbol;

declare namespace TypeDataModel {
  export type Any = TypeDataModel<any, any, any, any>;

  // This still is only allows classes descended from `TypeDataField` because these unique symbols aren't used elsewhere.
  // These generic parameters seem to be required. This is likely because of a TypeScript soundness holes in which concrete types like `any` or `unknown`
  // will get treated bivariantly whereas type parameters get treated more safely.
  type TypeDataModelInternal<
    Schema extends DataSchema,
    Parent extends Document.Any,
    BaseModel,
    BaseData,
    DerivedData,
  > = {
    [__Schema]: Schema;
    [__Parent]: Parent;
    [__BaseModel]: BaseModel;
    [__BaseData]: BaseData;
    [__DerivedData]: DerivedData;
  };

  // Removes the base and derived data from the type.
  // Has no extends bounds to simplify any checking logic.
  type RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData> = SimpleMerge<
    Omit<BaseThis, keyof BaseData | keyof DerivedData>,
    BaseModel
  >;

  export type PrepareBaseDataThis<BaseThis extends TypeDataModelInternal<any, any, any, any, any>> =
    BaseThis extends TypeDataModelInternal<any, any, infer BaseModel, infer BaseData, infer DerivedData>
      ? MergePartial<Omit<RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData>, "prepareBaseData">, BaseData>
      : never;

  export type PrepareDerivedDataThis<BaseThis extends TypeDataModelInternal<any, any, any, any, any>> =
    BaseThis extends TypeDataModelInternal<any, any, infer BaseModel, infer BaseData, infer DerivedData>
      ? MergePartial<
          SimpleMerge<Omit<RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData>, "prepareDerivedData">, BaseData>,
          DerivedData
        >
      : never;

  // Merges U into T but makes the appropriate keys partial.
  // This is similar to `Merge<T, DeepPartial<U>>` but only makes the deepest keys in `U` optional.
  type MergePartial<T, U> = Omit<T, keyof U> & {
    [K in keyof U as K extends PartialMergeKeys<T, U> ? K : never]?: InnerMerge<U, K, T>;
  } & {
    [K in keyof U as K extends PartialMergeKeys<T, U> ? never : K]: InnerMerge<U, K, T>;
  };

  type RequiredKeys<T> = {
    [K in keyof T]-?: T extends { readonly [_ in K]: any } ? K : never;
  }[keyof T];

  // Returns all the keys of U that should be partial when merged into T.
  // Only if both `T[K]` and `U[K]` are required and both are objects should a key be required.
  // This is because essentially only the most deep keys that are merged in need to be optional.
  type PartialMergeKeys<T, U> = {
    [K in keyof U]-?: K extends RequiredKeys<U>
      ? K extends RequiredKeys<T>
        ? IsObject<T[K]> extends true
          ? IsObject<U[K]> extends true
            ? never
            : K
          : K
        : K
      : K;
  }[keyof U];

  // Merges `U[K]` into `T[K]` if they're both objects, returns `U[K]` otherwise.
  type InnerMerge<U, K extends keyof U, T> = T extends { readonly [_ in K]?: infer V }
    ? IsObject<U[K]> extends true
      ? IsObject<V> extends true
        ? MergePartial<V, U[K]>
        : Partial<U[K]>
      : Partial<U[K]>
    : U[K];

  export type ParentAssignmentType<BaseThis extends TypeDataModelInternal<any, any, any, any, any>> =
    BaseThis extends TypeDataModelInternal<infer Schema, infer Parent, any, any, any>
      ? SimpleMerge<
          SchemaField.InitializedType<Document.SchemaFor<Parent>>,
          {
            // FIXME(LukeAbby): Callers handle making this partial when obvious.
            // However also should make system partial using the regular rules: if `initial` is assignable to the field or if `required` is false etc.
            system: SchemaField.InitializedType<Schema>;
          }
        >
      : never;
}

/**
 * A specialized subclass of DataModel, intended to represent a Document's type-specific data.
 * Systems or Modules that provide DataModel implementations for sub-types of Documents (such as Actors or Items)
 * should subclass this class instead of the base DataModel class.
 *
 *
 * @example Registering a custom sub-type for a Module.
 *
 * **module.json**
 * ```json
 * {
 *   "id": "my-module",
 *   "esmodules": ["main.mjs"],
 *   "documentTypes": {
 *     "Actor": {
 *       "sidekick": {},
 *       "villain": {}
 *     },
 *     "JournalEntryPage": {
 *       "dossier": {},
 *       "quest": {
 *         "htmlFields": ["description"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * **main.mjs**
 * ```js
 * Hooks.on("init", () => {
 *   Object.assign(CONFIG.Actor.dataModels, {
 *     "my-module.sidekick": SidekickModel,
 *     "my-module.villain": VillainModel
 *   });
 *   Object.assign(CONFIG.JournalEntryPage.dataModels, {
 *     "my-module.dossier": DossierModel,
 *     "my-module.quest": QuestModel
 *   });
 * });
 *
 * class QuestModel extends foundry.abstract.TypeDataModel {
 *   static defineSchema() {
 *     const fields = foundry.data.fields;
 *     return {
 *       description: new fields.HTMLField({required: false, blank: true, initial: ""}),
 *       steps: new fields.ArrayField(new fields.StringField())
 *     };
 *   }
 *
 *   prepareDerivedData() {
 *     this.totalSteps = this.steps.length;
 *   }
 * }
 * ```
 */
export default abstract class TypeDataModel<
  Schema extends DataSchema,
  Parent extends Document.Any,
  BaseData extends Record<string, unknown> = Record<string, never>,
  DerivedData extends Record<string, unknown> = Record<string, never>,
> extends _InternalTypeDataModel<Schema, Parent, BaseData, DerivedData> {
  [__Schema]: Schema;
  [__Parent]: Parent;
  [__BaseModel]: DataModel<Schema, Parent>;
  [__BaseData]: RemoveIndexSignatures<BaseData>;
  [__DerivedData]: RemoveIndexSignatures<DerivedData>;

  modelProvider: System | Module | null;

  /**
   * A set of localization prefix paths which are used by this data model.
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Prepare data related to this DataModel itself, before any derived data is computed.
   *
   * Called before {@link ClientDocument#prepareBaseData} in {@link ClientDocument#prepareData}.
   * */
  prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void;

  /**
   * Apply transformations of derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   *
   * Called before {@link ClientDocument#prepareDerivedData} in {@link ClientDocument#prepareData}.
   */
  prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void;

  /**
   * Convert this Document to some HTML display for embedding purposes.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content
   *                  also contains text that must be enriched.
   */
  toEmbed(
    config: TextEditor.DocumentHTMLEmbedConfig,
    options: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | HTMLCollection | null>;

  /* -------------------------------------------- */
  /*  Database Operations                         */
  /* -------------------------------------------- */

  /**
   * Called by {@link ClientDocument#_preCreate}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   * @returns Return false to exclude this Document from the creation operation
   */
  protected _preCreate(
    data: TypeDataModel.ParentAssignmentType<this>,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onCreate}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(
    data: TypeDataModel.ParentAssignmentType<this>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument#_preUpdate}.
   *
   * @param changes - The candidate changes to the Document
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   * @returns A return value of false indicates the update operation should be cancelled.
   */
  protected _preUpdate(
    changes: DeepPartial<TypeDataModel.ParentAssignmentType<this>>,
    options: DocumentModificationOptions,
    userId: string,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onUpdate}.
   *
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: DeepPartial<TypeDataModel.ParentAssignmentType<this>>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument#_preDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the deletion operation should be cancelled.
   */
  protected _preDelete(options: DocumentModificationOptions, user: BaseUser): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;
}
