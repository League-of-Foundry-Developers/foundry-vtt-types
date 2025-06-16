import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The ChatMessage Document.
 * Defines the DataSchema and common behaviors for a ChatMessage which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseChatMessage<
  out SubType extends BaseChatMessage.SubType = BaseChatMessage.SubType,
> extends Document<"ChatMessage", BaseChatMessage._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseChatMessage`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseChatMessage` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link ChatMessage.implementation | `new ChatMessage.implementation(...)`} instead which will give you
   * a system specific implementation of `ChatMessage`.
   */
  constructor(...args: ChatMessage.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "ChatMessage",
   *   collection: "messages",
   *   label: "DOCUMENT.ChatMessage",
   *   labelPlural: "DOCUMENT.ChatMessages",
   *   hasTypeData: true,
   *   isPrimary: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseChatMessage.Metadata;

  static override defineSchema(): BaseChatMessage.Schema;

  /**
   * @remarks Returns `true` if `user` is the `author` of the `ChatMessage` and `options.exact` is falsey.
   * Otherwise, forwards to {@link Document.testUserPermission | `Document#testUserPermission`}
   */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * @remarks
   * Migrations:
   * - `user` to `author` (since v12, no specified end)
   * - existing numeric `type`s to `style`, setting `type` to `"base"` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `user` to `author` (since v12, until v14)
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks Replaced by `author`
   */
  get user(): this["author"];

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

  override readonly parentCollection: ChatMessage.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): ChatMessage.ImplementationClass;

  static override get baseDocument(): typeof BaseChatMessage;

  static override get collectionName(): ChatMessage.ParentCollectionName;

  static override get documentName(): ChatMessage.Name;

  static override get TYPES(): BaseChatMessage.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): ChatMessage.Hierarchy;

  override system: ChatMessage.SystemOfType<SubType>;

  override parent: BaseChatMessage.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ChatMessage.Implementation | ChatMessage.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ChatMessage.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<ChatMessage.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: ChatMessage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<ChatMessage.Database.Update>,
  ): Promise<ChatMessage.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<ChatMessage.Database.Delete>,
  ): Promise<ChatMessage.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: ChatMessage.CreateData | ChatMessage.CreateData[],
    operation?: ChatMessage.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<ChatMessage.Implementation, Temporary> | undefined>;

  override update(
    data: ChatMessage.UpdateData | undefined,
    operation?: ChatMessage.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: ChatMessage.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: ChatMessage.Database.GetOptions): ChatMessage.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends ChatMessage.Flags.Scope, Key extends ChatMessage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<ChatMessage.Name, Scope, Key>;

  override setFlag<
    Scope extends ChatMessage.Flags.Scope,
    Key extends ChatMessage.Flags.Key<Scope>,
    Value extends Document.GetFlag<ChatMessage.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends ChatMessage.Flags.Scope, Key extends ChatMessage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ChatMessage.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: ChatMessage.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: ChatMessage.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Delete,
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
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<ChatMessage.Schema>;

  static override get schema(): SchemaField<ChatMessage.Schema>;

  static override validateJoint(data: ChatMessage.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: ChatMessage.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ChatMessage.Implementation;

  static override fromJSON(json: string): ChatMessage.Implementation;

  static #BaseChatMessage: true;
}

export default BaseChatMessage;

declare namespace BaseChatMessage {
  export import Name = ChatMessage.Name;
  export import ConstructorArgs = ChatMessage.ConstructorArgs;
  export import Hierarchy = ChatMessage.Hierarchy;
  export import Metadata = ChatMessage.Metadata;
  export import SubType = ChatMessage.SubType;
  export import ConfiguredSubTypes = ChatMessage.ConfiguredSubTypes;
  export import Known = ChatMessage.Known;
  export import OfType = ChatMessage.OfType;
  export import SystemOfType = ChatMessage.SystemOfType;
  export import Parent = ChatMessage.Parent;
  export import Descendant = ChatMessage.Descendant;
  export import DescendantClass = ChatMessage.DescendantClass;
  export import Pack = ChatMessage.Pack;
  export import Embedded = ChatMessage.Embedded;
  export import ParentCollectionName = ChatMessage.ParentCollectionName;
  export import CollectionClass = ChatMessage.CollectionClass;
  export import Collection = ChatMessage.Collection;
  export import Invalid = ChatMessage.Invalid;
  export import Stored = ChatMessage.Stored;
  export import Source = ChatMessage.Source;
  export import CreateData = ChatMessage.CreateData;
  export import InitializedData = ChatMessage.InitializedData;
  export import UpdateData = ChatMessage.UpdateData;
  export import Schema = ChatMessage.Schema;
  export import DatabaseOperation = ChatMessage.Database;
  export import Flags = ChatMessage.Flags;
  export import CoreFlags = ChatMessage.CoreFlags;
  export import GetSpeakerOptions = ChatMessage.GetSpeakerOptions;
  export import MessageData = ChatMessage.MessageData;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `ChatMessage` a name.
    // The expression `ClientDocumentMixin(BaseChatMessage)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseChatMessage> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends ChatMessage.Schema {
    system: any;
  }
}
