import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "#common/data/fields.mjs";

/**
 * The RegionBehavior Document.
 * Defines the DataSchema and common behaviors for a RegionBehavior which are shared between both client and server.
 */
declare abstract class BaseRegionBehavior<
  out SubType extends BaseRegionBehavior.SubType = BaseRegionBehavior.SubType,
> extends Document<"RegionBehavior", BaseRegionBehavior._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRegionBehavior`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseRegionBehavior` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode RegionBehavior.implementation | new RegionBehavior.implementation(...)} instead which will give you
   * a system specific implementation of `RegionBehavior`.
   */
  constructor(data: BaseRegionBehavior.CreateData, context?: BaseRegionBehavior.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "RegionBehavior",
   *   collection: "behaviors",
   *   label: "DOCUMENT.RegionBehavior",
   *   labelPlural: "DOCUMENT.RegionBehaviors",
   *   coreTypes: [
   *     "adjustDarknessLevel",
   *     "displayScrollingText",
   *     "executeMacro",
   *     "executeScript",
   *     "modifyMovementCost",
   *     "pauseGame",
   *     "suppressWeather",
   *     "teleportToken",
   *     "toggleBehavior"
   *   ],
   *   hasTypeData: true,
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseRegionBehavior.Metadata;

  static override defineSchema(): BaseRegionBehavior.Schema;

  /** @defaultValue `["DOCUMENT", "BEHAVIOR"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @remarks Returns `user.isGM` */
  static override canUserCreate(user: User.Implementation): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  type: SubType;

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: BaseRegionBehavior.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): RegionBehavior.ImplementationClass;

  static override get baseDocument(): typeof BaseRegionBehavior;

  static override get collectionName(): BaseRegionBehavior.ParentCollectionName;

  static override get documentName(): BaseRegionBehavior.Name;

  static override get TYPES(): BaseRegionBehavior.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseRegionBehavior.Hierarchy;

  override system: BaseRegionBehavior.SystemOfType<SubType>;

  override parent: BaseRegionBehavior.Parent;

  override " fvtt_types_internal_document_parent": BaseRegionBehavior.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<RegionBehavior.Implementation | BaseRegionBehavior.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseRegionBehavior.Database.Create<Temporary>>,
  ): Promise<Array<BaseRegionBehavior.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseRegionBehavior.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseRegionBehavior.Database.Update>,
  ): Promise<RegionBehavior.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseRegionBehavior.Database.Delete>,
  ): Promise<RegionBehavior.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseRegionBehavior.CreateData | BaseRegionBehavior.CreateData[],
    operation?: BaseRegionBehavior.Database.CreateOperation<Temporary>,
  ): Promise<BaseRegionBehavior.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseRegionBehavior.UpdateData | undefined,
    operation?: BaseRegionBehavior.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseRegionBehavior.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseRegionBehavior.Database.GetOptions,
  ): RegionBehavior.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseRegionBehavior.Flags.Scope, Key extends BaseRegionBehavior.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseRegionBehavior.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseRegionBehavior.Flags.Scope,
    Key extends BaseRegionBehavior.Flags.Key<Scope>,
    Value extends BaseRegionBehavior.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseRegionBehavior.Flags.Scope, Key extends BaseRegionBehavior.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseRegionBehavior.CreateData,
    options: BaseRegionBehavior.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseRegionBehavior.CreateData,
    options: BaseRegionBehavior.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseRegionBehavior.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: BaseRegionBehavior.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseRegionBehavior.UpdateData,
    options: BaseRegionBehavior.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseRegionBehavior.UpdateData,
    options: BaseRegionBehavior.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: BaseRegionBehavior.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: BaseRegionBehavior.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseRegionBehavior.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseRegionBehavior.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: BaseRegionBehavior.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: BaseRegionBehavior.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<BaseRegionBehavior.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<BaseRegionBehavior.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<BaseRegionBehavior.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseRegionBehavior.Schema>;

  static override get schema(): SchemaField<BaseRegionBehavior.Schema>;

  static override validateJoint(data: BaseRegionBehavior.Source): void;

  static override fromSource(
    source: BaseRegionBehavior.UpdateData,
    context?: DataModel.FromSourceOptions,
  ): RegionBehavior.Implementation;

  static override fromJSON(json: string): RegionBehavior.Implementation;

  static #BaseRegionBehavior: true;
}

export default BaseRegionBehavior;

declare namespace BaseRegionBehavior {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = RegionBehavior.Name;
  export import ConstructionContext = RegionBehavior.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = RegionBehavior.ConstructorArgs;
  export import Hierarchy = RegionBehavior.Hierarchy;
  export import Metadata = RegionBehavior.Metadata;
  export import SubType = RegionBehavior.SubType;
  export import ConfiguredSubType = RegionBehavior.ConfiguredSubType;
  export import Known = RegionBehavior.Known;
  export import OfType = RegionBehavior.OfType;
  export import SystemOfType = RegionBehavior.SystemOfType;
  export import Parent = RegionBehavior.Parent;
  export import Descendant = RegionBehavior.Descendant;
  export import DescendantClass = RegionBehavior.DescendantClass;
  export import Embedded = RegionBehavior.Embedded;
  export import ParentCollectionName = RegionBehavior.ParentCollectionName;
  export import CollectionClass = RegionBehavior.CollectionClass;
  export import Collection = RegionBehavior.Collection;
  export import Invalid = RegionBehavior.Invalid;
  export import Stored = RegionBehavior.Stored;
  export import Source = RegionBehavior.Source;
  export import CreateData = RegionBehavior.CreateData;
  export import CreateInput = RegionBehavior.CreateInput;
  export import CreateReturn = RegionBehavior.CreateReturn;
  export import InitializedData = RegionBehavior.InitializedData;
  export import UpdateData = RegionBehavior.UpdateData;
  export import UpdateInput = RegionBehavior.UpdateInput;
  export import Schema = RegionBehavior.Schema;
  export import Database = RegionBehavior.Database;
  export import TemporaryIf = RegionBehavior.TemporaryIf;
  export import Flags = RegionBehavior.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `RegionBehavior` a name.
    // The expression `ClientDocumentMixin(BaseRegionBehavior)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseRegionBehavior> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends RegionBehavior.Schema {
    system: any;
  }
}
