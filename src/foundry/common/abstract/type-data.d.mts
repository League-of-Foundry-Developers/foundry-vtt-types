import type {
  MustConform,
  AnyObject,
  EmptyObject,
  DeepPartial,
  Merge,
  RemoveIndexSignatures,
  SimpleMerge,
  Identity,
  IsObject,
  AllKeysOf,
  GetKey,
  Override,
} from "#utils";
import type { SchemaField } from "../data/fields.d.mts";
import type { DatabaseCreateOperation, DatabaseDeleteOperation, DatabaseUpdateOperation } from "./_types.d.mts";
import type { DataModel } from "./data.d.mts";
import type Document from "./document.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";

type DataSchema = foundry.data.fields.DataSchema;

interface _InternalTypeDataModelInterface extends DataModel.AnyConstructor {
  new <Schema extends DataSchema, Parent extends Document.Any, _ComputedInstance extends object>(
    ...args: DataModel.ConstructorArgs<Schema, Parent>
  ): DataModelOverride<Schema, Parent, _ComputedInstance>;
}

// Patterns of the form `interface Example<T> extends T {}` don't count as using `T`. From tsc's
// point of view when calculating variance it may as well look like `interface Example<T> {}`.
// Fundamentally this ordinarily means `Example<T>` will always be assignable to `Example<U>` and
// vice versa.
//
// Obviously this is a problem, so `Uses` exists to add an unobtrusive covariant usage of the type
// parameter, making `Example<T>` assignable to `Example<U>` only if `T` is a subtype of `U`.
declare class Uses<T> {
  #t?: T;
}

// Note(LukeAbby): This is carefully written to ensure that TypeScript allows overriding `protected`
// methods of `DataModel` in subclasses. If `Override<DataModel<Schema, Parent>, _ComputedInstance>`
// is used instead. it doesn't work.
//
// See: https://gist.github.com/LukeAbby/b9fd57eeba778a25297721e88b3e6bdd
// @ts-expect-error This pattern is inherently an error.
interface DataModelOverride<Schema extends DataSchema, Parent extends Document.Any, _ComputedInstance extends object>
  extends _ComputedInstance,
    DataModel<Schema, Parent>,
    Uses<_ComputedInstance> {}

type UnmergePartial<
  Schema extends DataSchema,
  BaseData extends object,
  DerivedData extends object,
  Initialized extends object = SchemaField.InitializedData<Schema>,
> = {
  [K in keyof BaseData]?: BaseData[K];
} & {
  /**
   * @deprecated This property only exists once `prepareDerivedData` has been called.
   */
  // Note(LukeAbby): The above JSDoc is currently wishful thinking, hoping that JSDoc on index signatures
  // will be preserved eventually.
  // TODO(LukeAbby): At some point it may be a good idea to account for the messy union cases.
  [K in keyof DerivedData as K extends keyof BaseData | keyof Initialized ? never : K]?: never;
} & {
  [K in keyof Initialized as K extends keyof BaseData ? never : K]: Initialized[K];
};

type MergePartial<BaseThis, BaseData, DerivedData> = {
  [K in keyof BaseThis as K extends keyof BaseData | keyof DerivedData ? never : K]: BaseThis[K];
} & {
  [K in keyof BaseData as K extends keyof DerivedData ? never : K]: BaseData[K];
} & {
  [K in keyof DerivedData as K extends PartialKey<BaseData, DerivedData> ? K : never]?: _MergePartial<
    K,
    BaseThis,
    BaseData,
    DerivedData[K]
  >;
} & {
  [K in keyof DerivedData as K extends PartialKey<BaseData, DerivedData> ? never : K]: _MergePartial<
    K,
    BaseThis,
    BaseData,
    DerivedData[K]
  >;
};

// TODO(LukeAbby): The logic here is over-simplified.
type _MergePartial<K extends PropertyKey, BaseThis, BaseData, Derived> =
  IsObject<Derived> extends true ? MergePartial<GetObject<BaseThis, K>, GetObject<BaseData, K>, Derived> : Derived;

type GetObject<T, K extends PropertyKey> = T extends { readonly [_ in K]?: infer Result }
  ? IsObject<Result> extends true
    ? Result
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

type PartialKey<BaseData, DerivedData> = {
  [K in keyof MetadataFor<DerivedData>]: _PartialKey<K, GetKey<MetadataFor<BaseData>, K>, MetadataFor<DerivedData>[K]>;
}[keyof MetadataFor<DerivedData>];

// A key should be partial when at least one of `BaseData` and `DerivedData` is not an object or
// at least one one of `BaseData` and `DerivedData` is not required.
type _PartialKey<
  K extends PropertyKey,
  BaseMetadata extends Metadata,
  DerivedMetadata extends Metadata,
> = false extends BaseMetadata["isObject"] | DerivedMetadata["isObject"]
  ? K
  : true extends BaseMetadata["isOptional"] | DerivedMetadata["isOptional"]
    ? K
    : never;

interface Metadata {
  isOptional: boolean;
  isObject: boolean;
}

type MetadataFor<T> = _MetadataFor<{
  [K in keyof T]-?: {
    isOptional: T extends { readonly [_ in K]: unknown } ? false : true;
    isObject: IsObject<T[K]>;
  };
}>;

type _MetadataFor<T extends Record<PropertyKey, Metadata>> = {
  [K in AllKeysOf<T>]: {
    isOptional: T[K]["isOptional"];
    isObject: T[K]["isObject"];
  };
};

declare const _InternalTypeDataModelConst: _InternalTypeDataModelInterface;

declare class _InternalTypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<Document.Type, DataSchema, Document.Any | null>,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
  // This does not work if inlined. It's weird to put it here but it works.
  _ComputedInstance extends object = Merge<RemoveIndexSignatures<BaseData>, RemoveIndexSignatures<DerivedData>>,
> extends _InternalTypeDataModelConst<Schema, Parent, _ComputedInstance> {}

declare const __TypeDataModelBrand: unique symbol;

type _ClassMustBeAssignableToInternal = MustConform<typeof Document, Document.Internal.Constructor>;
type _InstanceMustBeAssignableToInternal = MustConform<Document.Any, Document.Internal.Instance.Any>;

declare namespace TypeDataModel {
  interface Any extends AnyTypeDataModel {}
  interface AnyConstructor extends Identity<typeof AnyTypeDataModel> {}

  type ConfigurationFailureInstance = ConfigurationFailure;
  type ConfigurationFailureClass = typeof ConfigurationFailure;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (...args: never) => Instance.Any) & {
      [__TypeDataModelBrand]: never;
    };

    // This still is only allows instances descended from `TypeDataField` because these unique symbols aren't used elsewhere.
    // These generic parameters seem to be required. This is likely because of a TypeScript soundness holes in which concrete types like `any` or `unknown`
    // will get treated bivariantly whereas type parameters get treated more safely.
    interface Instance<
      out Schema extends DataSchema,
      out Parent extends Document.Any,
      out BaseModel,
      out BaseData extends AnyObject,
      out DerivedData extends AnyObject,
    > {
      " __fvtt_types_schema": Schema;
      " __fvtt_types_parent": Parent;
      " __fvtt_types_base_model": BaseModel;
      " __fvtt_types_base_data": BaseData;
      " __fvtt_types_derived_data": DerivedData;
    }

    namespace Instance {
      interface Any extends Instance<any, any, any, any, any> {}
    }
  }

  type PrepareBaseDataThis<BaseThis extends Internal.Instance.Any> =
    BaseThis extends Internal.Instance<infer Schema, infer _1, infer _2, infer BaseData, infer DerivedData>
      ? Override<BaseThis, UnmergePartial<Schema, RemoveIndexSignatures<BaseData>, RemoveIndexSignatures<DerivedData>>>
      : never;

  type PrepareDerivedDataThis<BaseThis extends Internal.Instance.Any> =
    BaseThis extends Internal.Instance<infer Schema, infer _1, infer _2, infer BaseData, infer DerivedData>
      ? Override<
          BaseThis,
          MergePartial<
            // TODO: Put back in `BaseThis` and write as yet another unmerge
            SchemaField.InitializedData<Schema>,
            RemoveIndexSignatures<BaseData>,
            RemoveIndexSignatures<DerivedData>
          >
        >
      : never;

  type ParentAssignmentType<Schema extends DataSchema, Parent extends Document.Internal.Instance.Any> = SimpleMerge<
    SchemaField.InitializedData<Document.SchemaFor<Parent>>,
    {
      // FIXME(LukeAbby): Callers handle making this partial when obvious.
      // However also should make system partial using the regular rules: if `initial` is assignable to the field or if `required` is false etc.
      system: SchemaField.InitializedData<Schema>;
    }
  >;
}

declare abstract class AnyTypeDataModel extends TypeDataModel<any, any, any, any> {
  constructor(...args: never);
}

/**
 * A specialized subclass of DataModel, intended to represent a Document's type-specific data.
 * Systems or Modules that provide DataModel implementations for sub-types of Documents (such as Actors or Items)
 * should subclass this class instead of the base DataModel class.
 *
 * @example
 * Registering a custom sub-type for a Module.
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
 *
 * **en.json** To provide the localization for methods like `ClientDocument.createDialog`
 *
 * ```json
 * {
 *   "TYPES": {
 *     "Actor": {
 *       "sidekick": "Sidekick",
 *       "villain": "Villain"
 *     },
 *     "JournalEntryPage": {
 *       "dossier": "Dossier",
 *       "quest": "Quest"
 *     }
 *   }
 * }
 * ```
 */
declare abstract class TypeDataModel<
  Schema extends DataSchema,
  Parent extends Document.Any,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
> extends _InternalTypeDataModel<Schema, Parent, BaseData, DerivedData> {
  static [__TypeDataModelBrand]: true;

  " __fvtt_types_schema": Schema;
  " __fvtt_types_parent": Parent;
  " __fvtt_types_base_model": DataModel<Schema, Parent>;
  " __fvtt_types_base_data": BaseData;
  " __fvtt_types_derived_data": DerivedData;

  modelProvider: foundry.packages.System | foundry.packages.Module | null;

  static override LOCALIZATION_PREFIXES: string[];

  /**
   * Prepare data related to this DataModel itself, before any derived data (including Active Effects)
   * is computed. This is especially useful for initializing numbers, arrays, and sets you expect to be
   * modified by active effects.
   *
   * Called before {@linkcode foundry.documents.abstract.ClientDocumentMixin.AnyMixed.prepareBaseData | ClientDocument#prepareBaseData} in
   * {@linkcode foundry.documents.abstract.ClientDocumentMixin.AnyMixed.prepareData | ClientDocument#prepareData}.
   *
   * @example
   * ```js
   * prepareBaseData() {
   *   // Ensures an active effect of `system.encumbrance.max | ADD | 10` doesn't produce `NaN`
   *   this.encumbrance = {
   *     max: 0
   *   }
   *   // If you need to access the owning Document, `this.parent` provides a reference for properties like the name
   *   // or embedded collections, e.g. `this.parent.name` or `this.parent.items`
   * }
   * ```
   */
  prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void;

  /**
   * Apply transformations or derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   *
   * Called before {@linkcode foundry.abstract.ClientDocumentMixin.AnyMixed.prepareDerivedData | ClientDocument#prepareDerivedData} in
   * {@linkcode foundry.abstract.ClientDocumentMixin.AnyMixed.prepareData | ClientDocument#prepareData}.
   *
   * @example
   * ```js
   * prepareDerivedData() {
   *   this.hp.bloodied = Math.floor(this.hp.max / 2);
   *
   *   // this.parent accesses the Document, allowing access to embedded collections
   *   this.encumbrance.value = this.parent.items.reduce((total, item) => {
   *     total += item.system.weight;
   *     return total;
   *   }, 0)
   * }
   * ```
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
   * Called by {@link ClientDocument._preCreate | `ClientDocument#_preCreate`}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   * @returns Return false to exclude this Document from the creation operation
   */
  protected _preCreate(
    data: TypeDataModel.ParentAssignmentType<Schema, Parent>,
    options: Document.Database.PreCreateOptions<DatabaseCreateOperation>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument._onCreate | `ClientDocument#_onCreate`}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  // TODO: should be `MaybePromise<void>` to allow async subclassing?
  protected _onCreate(
    data: TypeDataModel.ParentAssignmentType<Schema, Parent>,
    options: Document.Database.CreateOptions<DatabaseCreateOperation>,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument._preUpdate | `ClientDocument#_preUpdate`}.
   *
   * @param changes - The candidate changes to the Document
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   * @returns A return value of false indicates the update operation should be cancelled.
   */
  protected _preUpdate(
    changes: DeepPartial<TypeDataModel.ParentAssignmentType<Schema, Parent>>,
    options: Document.Database.PreUpdateOptions<DatabaseUpdateOperation>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument._onUpdate | `ClientDocument#_onUpdate`}.
   *
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  // TODO: should be `MaybePromise<void>` to allow async subclassing?
  protected _onUpdate(
    changed: DeepPartial<TypeDataModel.ParentAssignmentType<Schema, Parent>>,
    options: Document.Database.UpdateOptions<DatabaseUpdateOperation>,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument._preDelete | `ClientDocument#_preDelete`}.
   *
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the deletion operation should be cancelled.
   */
  protected _preDelete(
    options: Document.Database.PreDeleteOperationInstance<DatabaseDeleteOperation>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument._onDelete | `ClientDocument#_onDelete`}.
   *
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  // TODO: should be `MaybePromise<void>` to allow async subclassing?
  protected _onDelete(options: Document.Database.DeleteOptions<DatabaseDeleteOperation>, userId: string): void;
}

declare class ConfigurationFailure extends TypeDataModel<any, any, any, any> {}

export default TypeDataModel;
