import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";
import type { DataField, SchemaField } from "#common/data/fields.mjs";

/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 */
declare abstract class BaseRegion extends Document<"Region", BaseRegion.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRegion`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseRegion` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RegionDocument.implementation | `new RegionDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `RegionDocument`.
   */
  constructor(...args: RegionDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Region",
   *   collection: "regions",
   *   label: "DOCUMENT.Region",
   *   labelPlural: "DOCUMENT.Regions",
   *   isEmbedded: true,
   *   embedded: {
   *     RegionBehavior: "behaviors"
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseRegion.Metadata;

  static override defineSchema(): BaseRegion.Schema;

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: RegionDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): RegionDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseRegion;

  static override get collectionName(): RegionDocument.ParentCollectionName;

  static override get documentName(): RegionDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): RegionDocument.Hierarchy;

  override parent: BaseRegion.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RegionDocument.Implementation | RegionDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RegionDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<RegionDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: RegionDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RegionDocument.Database.Update>,
  ): Promise<RegionDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RegionDocument.Database.Delete>,
  ): Promise<RegionDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: RegionDocument.CreateData | RegionDocument.CreateData[],
    operation?: RegionDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<RegionDocument.Implementation, Temporary> | undefined>;

  override update(
    data: RegionDocument.UpdateData | undefined,
    operation?: RegionDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: RegionDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: RegionDocument.Database.GetOptions,
  ): RegionDocument.Implementation | null;

  static override getCollectionName<CollectionName extends RegionDocument.Embedded.Name>(
    name: CollectionName,
  ): RegionDocument.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends RegionDocument.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): RegionDocument.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends RegionDocument.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): RegionDocument.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends RegionDocument.Flags.Scope, Key extends RegionDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<RegionDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends RegionDocument.Flags.Scope,
    Key extends RegionDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<RegionDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends RegionDocument.Flags.Scope, Key extends RegionDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RegionDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: RegionDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: RegionDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): undefined;

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
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<RegionDocument.Schema>;

  static override get schema(): SchemaField<RegionDocument.Schema>;

  static override validateJoint(data: RegionDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: RegionDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RegionDocument.Implementation;

  static override fromJSON(json: string): RegionDocument.Implementation;
}

export default BaseRegion;

declare namespace BaseRegion {
  export import Name = RegionDocument.Name;
  export import ConstructorArgs = RegionDocument.ConstructorArgs;
  export import Hierarchy = RegionDocument.Hierarchy;
  export import Metadata = RegionDocument.Metadata;
  export import Parent = RegionDocument.Parent;
  export import Descendant = RegionDocument.Descendant;
  export import DescendantClass = RegionDocument.DescendantClass;
  export import Pack = RegionDocument.Pack;
  export import Embedded = RegionDocument.Embedded;
  export import ParentCollectionName = RegionDocument.ParentCollectionName;
  export import CollectionClass = RegionDocument.CollectionClass;
  export import Collection = RegionDocument.Collection;
  export import Invalid = RegionDocument.Invalid;
  export import Stored = RegionDocument.Stored;
  export import Source = RegionDocument.Source;
  export import CreateData = RegionDocument.CreateData;
  export import InitializedData = RegionDocument.InitializedData;
  export import UpdateData = RegionDocument.UpdateData;
  export import Schema = RegionDocument.Schema;
  export import DatabaseOperation = RegionDocument.Database;
  export import Flags = RegionDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `RegionDocument` a name.
    // The expression `CanvasDocumentMixin(BaseRegion)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseRegion> {}
    const CanvasDocument: CanvasDocument;
  }
}
