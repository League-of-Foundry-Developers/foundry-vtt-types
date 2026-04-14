import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.mjs";

/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 */
declare abstract class BaseRegion extends Document<"Region", BaseRegion.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRegion`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseRegion` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode RegionDocument.implementation | new RegionDocument.implementation(...)} instead which will give you
   * a system specific implementation of `RegionDocument`.
   */
  constructor(data: BaseRegion.CreateData, context?: BaseRegion.ConstructionContext);

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
   *   schemaVersion: "13.341"
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

  override readonly parentCollection: BaseRegion.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): RegionDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseRegion;

  static override get collectionName(): BaseRegion.ParentCollectionName;

  static override get documentName(): BaseRegion.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseRegion.Hierarchy;

  override parent: BaseRegion.Parent;

  override " fvtt_types_internal_document_parent": BaseRegion.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseRegion.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseRegion.Database.Create<Temporary>>,
  ): Promise<Array<BaseRegion.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseRegion.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseRegion.Database.Update>,
  ): Promise<Array<RegionDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseRegion.Database.Delete>,
  ): Promise<Array<RegionDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseRegion.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseRegion.Database.CreateOperation<Temporary>,
  ): Promise<BaseRegion.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseRegion.UpdateInput,
    operation?: BaseRegion.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseRegion.Database.DeleteOperation): Promise<this | undefined>;

  // `RegionDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseRegion.Database.GetOptions): null;

  static override getCollectionName<CollectionName extends BaseRegion.Embedded.Name>(
    name: CollectionName,
  ): BaseRegion.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseRegion.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseRegion.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseRegion.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseRegion.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseRegion.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseRegion.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseRegion.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseRegion.Flags.Scope, Key extends BaseRegion.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseRegion.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseRegion.Flags.Scope,
    Key extends BaseRegion.Flags.Key<Scope>,
    Value extends BaseRegion.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseRegion.Flags.Scope, Key extends BaseRegion.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseRegion.CreateData,
    options: BaseRegion.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseRegion.CreateData,
    options: BaseRegion.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseRegion.Database.Create>,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: RegionDocument.Stored[],
    operation: BaseRegion.Database.Create,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseRegion.UpdateData,
    options: BaseRegion.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseRegion.UpdateData,
    options: BaseRegion.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: RegionDocument.Stored[],
    operation: BaseRegion.Database.Update,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: RegionDocument.Stored[],
    operation: BaseRegion.Database.Update,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseRegion.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseRegion.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: RegionDocument.Stored[],
    operation: BaseRegion.Database.Delete,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: RegionDocument.Stored[],
    operation: BaseRegion.Database.Delete,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `RegionDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode RegionDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: RegionDocument.Implementation[],
    context: BaseRegion.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `RegionDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode RegionDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: RegionDocument.Stored[],
    context: BaseRegion.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `RegionDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode RegionDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: RegionDocument.Stored[],
    context: BaseRegion.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseRegion.Schema>;

  static override get schema(): SchemaField<BaseRegion.Schema>;

  static override validateJoint(data: BaseRegion.Source): void;

  static override fromSource(
    source: BaseRegion.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RegionDocument.Implementation;

  static override fromJSON(json: string): RegionDocument.Implementation;
}

export default BaseRegion;

declare namespace BaseRegion {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = RegionDocument.Name;
  export import ConstructionContext = RegionDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = RegionDocument.ConstructorArgs;
  export import Hierarchy = RegionDocument.Hierarchy;
  export import Metadata = RegionDocument.Metadata;
  export import Parent = RegionDocument.Parent;
  export import Descendant = RegionDocument.Descendant;
  export import DescendantClass = RegionDocument.DescendantClass;
  export import Embedded = RegionDocument.Embedded;
  export import ParentCollectionName = RegionDocument.ParentCollectionName;
  export import CollectionClass = RegionDocument.CollectionClass;
  export import Collection = RegionDocument.Collection;
  export import Invalid = RegionDocument.Invalid;
  export import Source = RegionDocument.Source;
  export import CreateData = RegionDocument.CreateData;
  export import CreateInput = RegionDocument.CreateInput;
  export import CreateReturn = RegionDocument.CreateReturn;
  export import InitializedData = RegionDocument.InitializedData;
  export import UpdateData = RegionDocument.UpdateData;
  export import UpdateInput = RegionDocument.UpdateInput;
  export import Schema = RegionDocument.Schema;
  export import Database = RegionDocument.Database;
  export import TemporaryIf = RegionDocument.TemporaryIf;
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
