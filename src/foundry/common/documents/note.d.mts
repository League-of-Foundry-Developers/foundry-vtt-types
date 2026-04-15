import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   * You should use {@linkcode NoteDocument.implementation | new NoteDocument.implementation(...)} instead which will give you
   * a system specific implementation of `NoteDocument`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: BaseNote.CreateData, context?: BaseNote.ConstructionContext);

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

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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

  override readonly parentCollection: BaseNote.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): NoteDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseNote;

  static override get collectionName(): BaseNote.ParentCollectionName;

  static override get documentName(): BaseNote.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseNote.Hierarchy;

  override parent: BaseNote.Parent;

  override " fvtt_types_internal_document_parent": BaseNote.Parent;

  // `canUserCreate` omitted from template due to actual override above.

  // `getUserLevel` omitted from template due to actual override above.

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseNote.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseNote.Database.Create<Temporary>>,
  ): Promise<Array<BaseNote.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseNote.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseNote.Database.Update>,
  ): Promise<Array<NoteDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseNote.Database.Delete>,
  ): Promise<Array<NoteDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseNote.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseNote.Database.CreateOperation<Temporary>,
  ): Promise<BaseNote.CreateReturn<Data, Temporary>>;

  override update(data: BaseNote.UpdateInput, operation?: BaseNote.Database.UpdateOperation): Promise<this | undefined>;

  override delete(operation?: BaseNote.Database.DeleteOperation): Promise<this | undefined>;

  // `NoteDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseNote.Database.GetOptions): null;

  // `NoteDocument`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseNote.Flags.Scope, Key extends BaseNote.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseNote.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseNote.Flags.Scope,
    Key extends BaseNote.Flags.Key<Scope>,
    Value extends BaseNote.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseNote.Flags.Scope, Key extends BaseNote.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseNote.CreateData,
    options: BaseNote.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseNote.CreateData,
    options: BaseNote.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseNote.Database.Create>,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: NoteDocument.Stored[],
    operation: BaseNote.Database.Create,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseNote.UpdateData,
    options: BaseNote.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseNote.UpdateData,
    options: BaseNote.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: NoteDocument.Stored[],
    operation: BaseNote.Database.Update,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: NoteDocument.Stored[],
    operation: BaseNote.Database.Update,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseNote.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseNote.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: NoteDocument.Stored[],
    operation: BaseNote.Database.Delete,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: NoteDocument.Stored[],
    operation: BaseNote.Database.Delete,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `NoteDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode NoteDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: NoteDocument.Implementation[],
    context: BaseNote.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `NoteDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode NoteDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: NoteDocument.Stored[],
    context: BaseNote.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `NoteDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode NoteDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: NoteDocument.Stored[],
    context: BaseNote.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseNote.Schema>;

  static override get schema(): SchemaField<BaseNote.Schema>;

  static override validateJoint(data: BaseNote.Source): void;

  static override fromSource(
    source: BaseNote.CreateData,
    context?: DataModel.FromSourceOptions,
  ): NoteDocument.Implementation;

  static override fromJSON(json: string): NoteDocument.Implementation;
}

export default BaseNote;

declare namespace BaseNote {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = NoteDocument.Name;
  export import ConstructionContext = NoteDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = NoteDocument.ConstructorArgs;
  export import Hierarchy = NoteDocument.Hierarchy;
  export import Metadata = NoteDocument.Metadata;
  export import Parent = NoteDocument.Parent;
  export import Descendant = NoteDocument.Descendant;
  export import DescendantClass = NoteDocument.DescendantClass;
  export import Embedded = NoteDocument.Embedded;
  export import ParentCollectionName = NoteDocument.ParentCollectionName;
  export import CollectionClass = NoteDocument.CollectionClass;
  export import Collection = NoteDocument.Collection;
  export import Invalid = NoteDocument.Invalid;
  export import Source = NoteDocument.Source;
  export import CreateData = NoteDocument.CreateData;
  export import CreateInput = NoteDocument.CreateInput;
  export import CreateReturn = NoteDocument.CreateReturn;
  export import InitializedData = NoteDocument.InitializedData;
  export import UpdateData = NoteDocument.UpdateData;
  export import UpdateInput = NoteDocument.UpdateInput;
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
