import type { AnyObject, AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
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
   * @deprecated Constructing `BaseChatMessage` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link ChatMessage.implementation | `new ChatMessage.implementation(...)`} instead which will give you
   * a system specific implementation of `ChatMessage`.
   */
  constructor(...args: ChatMessage.ConstructorArgs);

  static override metadata: BaseChatMessage.Metadata;

  static override defineSchema(): BaseChatMessage.Schema;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{ exact: boolean }>,
  ): boolean;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

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

  static " fvtt_types_internal_document_name_static": "ChatMessage";

  readonly parentCollection: ChatMessage.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): ChatMessage.ImplementationClass;

  static get baseDocument(): typeof BaseChatMessage;

  static get collectionName(): ChatMessage.ParentCollectionName;

  static get documentName(): ChatMessage.Name;

  static get TYPES(): BaseChatMessage.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): ChatMessage.Hierarchy;

  override system: ChatMessage.SystemOfType<SubType>;

  override parent: BaseChatMessage.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ChatMessage.Implementation | ChatMessage.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ChatMessage.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<ChatMessage.Implementation, Temporary>>>;

  static updateDocuments(
    updates: ChatMessage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<ChatMessage.Database.Update>,
  ): Promise<ChatMessage.Implementation[]>;

  static deleteDocuments(
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

  protected _preCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ChatMessage.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: ChatMessage.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: ChatMessage.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): true;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.
  protected static _addDataFieldShims(data: AnyObject, shims: AnyObject, options?: Document.DataFieldShimOptions): void;

  protected static _addDataFieldMigration(
    data: AnyObject,
    oldKey: string,
    newKey: string,
    apply?: (data: AnyObject) => unknown,
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: ChatMessage.Implementation[],
    context: Document.ModificationContext<ChatMessage.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<ChatMessage.Schema>;

  static get schema(): SchemaField<ChatMessage.Schema>;

  static validateJoint(data: ChatMessage.Source): void;

  static override fromSource(
    source: ChatMessage.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<ChatMessage.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<ChatMessage.Schema, DataModel.Any | null>;

  #baseChatMessage: true;
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
  export import Descendants = ChatMessage.Descendants;
  export import DescendantClasses = ChatMessage.DescendantClasses;
  export import Pack = ChatMessage.Pack;
  export import Embedded = ChatMessage.Embedded;
  export import ParentCollectionName = ChatMessage.ParentCollectionName;
  export import CollectionClass = ChatMessage.CollectionClass;
  export import Collection = ChatMessage.Collection;
  export import Stored = ChatMessage.Stored;
  export import Source = ChatMessage.Source;
  export import PersistedData = ChatMessage.PersistedData;
  export import CreateData = ChatMessage.CreateData;
  export import InitializedData = ChatMessage.InitializedData;
  export import UpdateData = ChatMessage.UpdateData;
  export import Schema = ChatMessage.Schema;
  export import DatabaseOperation = ChatMessage.Database;
  export import Flags = ChatMessage.Flags;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends ChatMessage.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseChatMessage.SubType | `BaseChatMessage.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseChatMessage.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseChatMessage.CreateData | `BaseChatMessage.CreateData`}
   */
  type ConstructorData = BaseChatMessage.CreateData;
}
