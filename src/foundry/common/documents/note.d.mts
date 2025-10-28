import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Note.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseNote extends Document<"Note", BaseNote.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseNote`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseNote` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link NoteDocument.implementation | `new NoteDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `NoteDocument`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: NoteDocument.CreateData, context?: NoteDocument.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Note",
   *   collection: "notes",
   *   label: "DOCUMENT.Note",
   *   labelPlural: "DOCUMENT.Notes",
   *   permissions: {
   *     create: BaseNote.#canCreate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseNote.Metadata;

  static override defineSchema(): BaseNote.Schema;

  /** @defaultValue `["DOCUMENT", "NOTE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for newly created Note documents.
   * @defaultValue `"icons/svg/book.svg"`
   */
  static DEFAULT_ICON: string;

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: NoteDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): NoteDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseNote;

  static override get collectionName(): NoteDocument.ParentCollectionName;

  static override get documentName(): NoteDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): NoteDocument.Hierarchy;

  override parent: NoteDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<NoteDocument.Implementation | NoteDocument.CreateData> | undefined,
    operation?: Document.Database.CreateDocumentsOperation<NoteDocument.Database.Create<Temporary>>,
  ): Promise<Array<NoteDocument.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: NoteDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<NoteDocument.Database.Update>,
  ): Promise<NoteDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<NoteDocument.Database.Delete>,
  ): Promise<NoteDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: NoteDocument.CreateData | NoteDocument.CreateData[],
    operation?: NoteDocument.Database.CreateOperation<Temporary>,
  ): Promise<NoteDocument.TemporaryIf<Temporary> | undefined>;

  override update(
    data: NoteDocument.UpdateData | undefined,
    operation?: NoteDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: NoteDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: NoteDocument.Database.GetOptions,
  ): NoteDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends NoteDocument.Flags.Scope, Key extends NoteDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): NoteDocument.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends NoteDocument.Flags.Scope,
    Key extends NoteDocument.Flags.Key<Scope>,
    Value extends NoteDocument.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends NoteDocument.Flags.Scope, Key extends NoteDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<NoteDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: NoteDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: NoteDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<NoteDocument.Schema>;

  static override get schema(): SchemaField<NoteDocument.Schema>;

  static override validateJoint(data: NoteDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: NoteDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): NoteDocument.Implementation;

  static override fromJSON(json: string): NoteDocument.Implementation;
}

export default BaseNote;

declare namespace BaseNote {
  export import Name = NoteDocument.Name;
  export import ConstructionContext = NoteDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = NoteDocument.ConstructorArgs;
  export import Hierarchy = NoteDocument.Hierarchy;
  export import Metadata = NoteDocument.Metadata;
  export import Parent = NoteDocument.Parent;
  export import Descendant = NoteDocument.Descendant;
  export import DescendantClass = NoteDocument.DescendantClass;
  export import Pack = NoteDocument.Pack;
  export import Embedded = NoteDocument.Embedded;
  export import ParentCollectionName = NoteDocument.ParentCollectionName;
  export import CollectionClass = NoteDocument.CollectionClass;
  export import Collection = NoteDocument.Collection;
  export import Invalid = NoteDocument.Invalid;
  export import Stored = NoteDocument.Stored;
  export import Source = NoteDocument.Source;
  export import CreateData = NoteDocument.CreateData;
  export import InitializedData = NoteDocument.InitializedData;
  export import UpdateData = NoteDocument.UpdateData;
  export import Schema = NoteDocument.Schema;
  export import Database = NoteDocument.Database;
  export import TemporaryIf = NoteDocument.TemporaryIf;
  export import Flags = NoteDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `NoteDocument` a name.
    // The expression `CanvasDocumentMixin(BaseNote)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseNote> {}
    const CanvasDocument: CanvasDocument;
  }
}
