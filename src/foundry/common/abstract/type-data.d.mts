import type {
  AnyObject,
  EmptyObject,
  DeepPartial,
  IsObject,
  Merge,
  RemoveIndexSignatures,
  SimpleMerge,
} from "../../../types/utils.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type BaseUser from "../documents/user.d.mts";
import type { DataModel } from "./data.d.mts";
import type {
  DocumentOnCreateOptions,
  DocumentOnDeleteOptions,
  DocumentOnUpdateOptions,
  DocumentPreCreateOptions,
  DocumentPreDeleteOptions,
  DocumentPreUpdateOptions,
} from "./document.d.mts";
import type Document from "./document.d.mts";

type StaticDataModel = typeof DataModel<DataSchema, Document<DataSchema, any, any>>;

interface _InternalTypeDataModelInterface extends StaticDataModel {
  new <Schema extends DataSchema, Parent extends Document.Any, _ComputedInstance extends DataModel<Schema, Parent>>(
    ...args: ConstructorParameters<typeof DataModel<Schema, Parent>>
  ): _ComputedInstance;
}

declare const _InternalTypeDataModelConst: _InternalTypeDataModelInterface;

// @ts-expect-error Ignore the error, this is a workaround for a dynamic class.
declare class _InternalTypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<DataSchema, any, any>,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
  // This does not work if inlined. It's weird to put it here but it works.
  _ComputedInstance extends DataModel<Schema, Parent> = SimpleMerge<
    Merge<RemoveIndexSignatures<BaseData>, RemoveIndexSignatures<DerivedData>>,
    // The merge is written this way because properties in the data model _cannot_ be allowed to be overridden by the base or derived data.
    // In theory this could be allowed but it causes a few difficulties.
    // The fundamental issue is that allowing this would cause subclasses to no longer guaranteed to be valid subtypes.
    // A particularly thorny but not fully fundamental issue is that it also causes difficulties with `this` inside of classes generic over `BaseData`.
    DataModel<Schema, Parent>
  >,
> extends _InternalTypeDataModelConst<Schema, Parent, _ComputedInstance> {}

declare const __TypeDataModelBrand: unique symbol;

// These properties are used to give a performant way of inferring types like `BaseData` and `DerivedData` types.
// This avoids checking the entire constraint `T extends TypeDataModel.Any` to infer out the types.
// To prevent adding properties that could appear at runtime they are unique symbols.
// This makes them uniterable and means that the only way to access them is to have a reference to the variables which will be impossible outside of this file.
declare const __Schema: unique symbol;
declare const __Parent: unique symbol;
declare const __BaseModel: unique symbol;
declare const __BaseData: unique symbol;
declare const __DerivedData: unique symbol;

// Removes the base and derived data from the type.
// Has no extends bounds to simplify any checking logic.
type RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData> = SimpleMerge<
  Omit<BaseThis, keyof BaseData | keyof DerivedData>,
  BaseModel
>;

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

declare namespace TypeDataModel {
  type Any = TypeDataModel<any, any, any, any>;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    interface Constructor {
      [__TypeDataModelBrand]: never;

      new (...args: never[]): Instance.Any;
    }

    // This still is only allows instances descended from `TypeDataField` because these unique symbols aren't used elsewhere.
    // These generic parameters seem to be required. This is likely because of a TypeScript soundness holes in which concrete types like `any` or `unknown`
    // will get treated bivariantly whereas type parameters get treated more safely.
    interface Instance<
      out Schema extends DataSchema,
      out Parent extends Document.Any,
      out BaseModel,
      out BaseData,
      out DerivedData,
    > {
      [__Schema]: Schema;
      [__Parent]: Parent;
      [__BaseModel]: BaseModel;
      [__BaseData]: BaseData;
      [__DerivedData]: DerivedData;
    }

    namespace Instance {
      type Any = Instance<any, any, any, any, any>;
    }
  }

  type PrepareBaseDataThis<BaseThis extends Internal.Instance.Any> =
    BaseThis extends Internal.Instance<any, any, infer BaseModel, infer BaseData, infer DerivedData>
      ? MergePartial<Omit<RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData>, "prepareBaseData">, BaseData>
      : never;

  type PrepareDerivedDataThis<BaseThis extends Internal.Instance.Any> =
    BaseThis extends Internal.Instance<any, any, infer BaseModel, infer BaseData, infer DerivedData>
      ? MergePartial<
          SimpleMerge<Omit<RemoveDerived<BaseThis, BaseModel, BaseData, DerivedData>, "prepareDerivedData">, BaseData>,
          DerivedData
        >
      : never;

  type ParentAssignmentType<BaseThis extends Internal.Instance.Any> =
    BaseThis extends Internal.Instance<infer Schema, infer Parent, any, any, any>
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
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
> extends _InternalTypeDataModel<Schema, Parent, BaseData, DerivedData> {
  static [__TypeDataModelBrand]: never;

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
    options: DocumentPreCreateOptions<any>,
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
    options: DocumentOnCreateOptions<any>,
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
    options: DocumentPreUpdateOptions<any>,
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
    options: DocumentOnUpdateOptions<any>,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument#_preDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the deletion operation should be cancelled.
   */
  protected _preDelete(options: DocumentPreDeleteOptions<any>, user: BaseUser): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentOnDeleteOptions<any>, userId: string): void;
}
