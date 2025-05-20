import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @deprecated Constructing `BaseNote` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link NoteDocument.implementation | `new NoteDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `NoteDocument`.
   */
  constructor(...args: NoteDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Note",
   *   collection: "notes",
   *   label: "DOCUMENT.Note",
   *   labelPlural: "DOCUMENT.Notes",
   *   permissions: {
   *     create: "NOTE_CREATE"
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseNote.Metadata;

  static override defineSchema(): BaseNote.Schema;

  /**
   * The default icon used for newly created Note documents.
   * @defaultValue `"icons/svg/book.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * @remarks Returns `true` for GMs regardless of `options.exact`
   *
   * If this is an unlinked note (lacks an `entryId`), returns `user.hasPermission("NOTE_CREATE")`. Otherwise,
   * `this.entry.testUserPermission`, or `false` if `!this.entry`. Core's `JournalEntry` implementation doesn't
   * override this method, so without further extension that's equivalent to {@link Document.testUserPermission | `Document#testUserPermission`}
   */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Internal.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

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

  static " fvtt_types_internal_document_name_static": "Note";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: NoteDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): NoteDocument.ImplementationClass;

  static get baseDocument(): typeof BaseNote;

  static get collectionName(): NoteDocument.ParentCollectionName;

  static get documentName(): NoteDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): NoteDocument.Hierarchy;

  override parent: NoteDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<NoteDocument.Implementation | NoteDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<NoteDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<NoteDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: NoteDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<NoteDocument.Database.Update>,
  ): Promise<NoteDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<NoteDocument.Database.Delete>,
  ): Promise<NoteDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: NoteDocument.CreateData | NoteDocument.CreateData[],
    operation?: NoteDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<NoteDocument.Implementation, Temporary> | undefined>;

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
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends NoteDocument.Flags.Scope, Key extends NoteDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<NoteDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends NoteDocument.Flags.Scope,
    Key extends NoteDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<NoteDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends NoteDocument.Flags.Scope, Key extends NoteDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<NoteDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: NoteDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: NoteDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

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

  protected static _onCreateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<NoteDocument.Schema>;

  static get schema(): SchemaField<NoteDocument.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: NoteDocument.Source): void;

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
  export import PersistedData = NoteDocument.PersistedData;
  export import CreateData = NoteDocument.CreateData;
  export import InitializedData = NoteDocument.InitializedData;
  export import UpdateData = NoteDocument.UpdateData;
  export import Schema = NoteDocument.Schema;
  export import DatabaseOperation = NoteDocument.Database;
  export import Flags = NoteDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `NoteDocument` a name.
    // The expression `CanvasDocumentMixin(BaseNote)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends CanvasDocumentMixin.Mix<typeof BaseNote> {}
    const CanvasDocument: CanvasDocument;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BaseNote.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BaseNote.CreateData}
   */
  type ConstructorData = BaseNote.CreateData;
}
