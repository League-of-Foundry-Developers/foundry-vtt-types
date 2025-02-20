import type { AnyObject, AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

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
  constructor(...args: Document.ConstructorParameters<BaseChatMessage.CreateData, BaseChatMessage.Parent>);

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
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "ChatMessage";

  static get implementation(): ChatMessage.ImplementationClass;

  override system: Document.SystemFor<"ChatMessage", SubType>;

  override parent: BaseChatMessage.Parent;

  static get TYPES(): BaseChatMessage.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ChatMessage.Implementation | ChatMessage.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ChatMessage.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<ChatMessage.Implementation, Temporary>>>;

  static updateDocuments(
    updates: ChatMessage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<ChatMessage.DatabaseOperation.Update>,
  ): Promise<ChatMessage.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<ChatMessage.DatabaseOperation.Delete>,
  ): Promise<ChatMessage.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: ChatMessage.CreateData | ChatMessage.CreateData[],
    operation?: Document.Database.CreateOperation<ChatMessage.DatabaseOperation.Create<Temporary>>,
  ): Promise<ChatMessage.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): ChatMessage.Implementation | null;

  protected _preCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: ChatMessage.CreateData,
    options: ChatMessage.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ChatMessage.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: ChatMessage.UpdateData,
    options: ChatMessage.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: ChatMessage.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: ChatMessage.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: ChatMessage.Implementation[],
    operation: ChatMessage.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
  export import Metadata = ChatMessage.Metadata;
  export import SubType = ChatMessage.SubType;
  export import Parent = ChatMessage.Parent;
  export import Stored = ChatMessage.Stored;
  export import Source = ChatMessage.Source;
  export import PersistedData = ChatMessage.PersistedData;
  export import CreateData = ChatMessage.CreateData;
  export import InitializedData = ChatMessage.InitializedData;
  export import UpdateData = ChatMessage.UpdateData;
  export import Schema = ChatMessage.Schema;
  export import DatabaseOperation = ChatMessage.DatabaseOperation;
  export import CoreFlags = ChatMessage.CoreFlags;

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
