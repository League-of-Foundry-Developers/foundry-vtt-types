import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";
import type { DataField, SchemaField } from "#common/data/fields.mjs";

/**
 * The RegionBehavior Document.
 * Defines the DataSchema and common behaviors for a RegionBehavior which are shared between both client and server.
 */
declare abstract class BaseRegionBehavior<
  out SubType extends BaseRegionBehavior.SubType = BaseRegionBehavior.SubType,
> extends Document<"RegionBehavior", BaseRegionBehavior._Schema, any> {
  #baseRegionBehavior: true;

  /**
   * @param data    - Initial data from which to construct the `BaseRegionBehavior`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseRegionBehavior` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RegionBehavior.implementation | `new RegionBehavior.implementation(...)`} instead which will give you
   * a system specific implementation of `RegionBehavior`.
   */
  constructor(...args: RegionBehavior.ConstructorArgs);

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
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseRegionBehavior.Metadata;

  static override defineSchema(): BaseRegionBehavior.Schema;

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

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "RegionBehavior";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: RegionBehavior.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): RegionBehavior.ImplementationClass;

  static override get baseDocument(): typeof BaseRegionBehavior;

  static override get collectionName(): RegionBehavior.ParentCollectionName;

  static override get documentName(): RegionBehavior.Name;

  static override get TYPES(): BaseRegionBehavior.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): RegionBehavior.Hierarchy;

  override system: RegionBehavior.SystemOfType<SubType>;

  override parent: BaseRegionBehavior.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RegionBehavior.Implementation | RegionBehavior.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RegionBehavior.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<RegionBehavior.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: RegionBehavior.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RegionBehavior.Database.Update>,
  ): Promise<RegionBehavior.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RegionBehavior.Database.Delete>,
  ): Promise<RegionBehavior.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: RegionBehavior.CreateData | RegionBehavior.CreateData[],
    operation?: RegionBehavior.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<RegionBehavior.Implementation, Temporary> | undefined>;

  override update(
    data: RegionBehavior.UpdateData | undefined,
    operation?: RegionBehavior.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: RegionBehavior.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: RegionBehavior.Database.GetOptions,
  ): RegionBehavior.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends RegionBehavior.Flags.Scope, Key extends RegionBehavior.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<RegionBehavior.Name, Scope, Key>;

  override setFlag<
    Scope extends RegionBehavior.Flags.Scope,
    Key extends RegionBehavior.Flags.Key<Scope>,
    Value extends Document.GetFlag<RegionBehavior.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends RegionBehavior.Flags.Scope, Key extends RegionBehavior.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: RegionBehavior.CreateData,
    options: RegionBehavior.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: RegionBehavior.CreateData,
    options: RegionBehavior.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RegionBehavior.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: RegionBehavior.UpdateData,
    options: RegionBehavior.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: RegionBehavior.UpdateData,
    options: RegionBehavior.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: RegionBehavior.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: RegionBehavior.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): true;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.

  // options: not null (parameter default only in _addDataFieldShim)
  protected static override _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  // options: not null (parameter default only)
  protected static override _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<RegionBehavior.Schema>;

  static override get schema(): SchemaField<RegionBehavior.Schema>;

  static override validateJoint(data: RegionBehavior.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: RegionBehavior.UpdateData,
    context?: DataModel.FromSourceOptions,
  ): RegionBehavior.Implementation;

  static override fromJSON(json: string): RegionBehavior.Implementation;

  static #BaseRegionBehavior: true;
}

export default BaseRegionBehavior;

declare namespace BaseRegionBehavior {
  export import Name = RegionBehavior.Name;
  export import ConstructorArgs = RegionBehavior.ConstructorArgs;
  export import Hierarchy = RegionBehavior.Hierarchy;
  export import Metadata = RegionBehavior.Metadata;
  export import SubType = RegionBehavior.SubType;
  export import ConfiguredSubTypes = RegionBehavior.ConfiguredSubTypes;
  export import Known = RegionBehavior.Known;
  export import OfType = RegionBehavior.OfType;
  export import SystemOfType = RegionBehavior.SystemOfType;
  export import Parent = RegionBehavior.Parent;
  export import Descendant = RegionBehavior.Descendant;
  export import DescendantClass = RegionBehavior.DescendantClass;
  export import Pack = RegionBehavior.Pack;
  export import Embedded = RegionBehavior.Embedded;
  export import ParentCollectionName = RegionBehavior.ParentCollectionName;
  export import CollectionClass = RegionBehavior.CollectionClass;
  export import Collection = RegionBehavior.Collection;
  export import Invalid = RegionBehavior.Invalid;
  export import Stored = RegionBehavior.Stored;
  export import Source = RegionBehavior.Source;
  export import PersistedData = RegionBehavior.PersistedData;
  export import CreateData = RegionBehavior.CreateData;
  export import InitializedData = RegionBehavior.InitializedData;
  export import UpdateData = RegionBehavior.UpdateData;
  export import Schema = RegionBehavior.Schema;
  export import DatabaseOperation = RegionBehavior.Database;
  export import Flags = RegionBehavior.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `RegionBehavior` a name.
    // The expression `ClientDocumentMixin(BaseRegionBehavior)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends ClientDocumentMixin.Mix<typeof BaseRegionBehavior> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends RegionBehavior.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated Replaced with {@linkcode BaseRegionBehavior.SubType} */
  type TypeNames = SubType;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BaseRegionBehavior.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BaseRegionBehavior.CreateData}
   */
  type ConstructorData = BaseRegionBehavior.CreateData;
}
