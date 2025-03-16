import type { AnyObject, AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type { DataModel } from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.d.mts";
import type { TokenDetectionMode } from "./_types.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseToken extends Document<"Token", BaseToken.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseToken`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseToken` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link TokenDocument.implementation | `new TokenDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `TokenDocument`.
   */
  constructor(...args: TokenDocument.ConstructorArgs);

  static override metadata: BaseToken.Metadata;

  static override defineSchema(): BaseToken.Schema;

  /**
   * Validate the structure of the detection modes array
   * @param modes - Configured detection modes
   * @throws An error if the array is invalid
   */
  static #validateDetectionModes(modes: TokenDetectionMode[]): void;

  /**
   * The default icon used for newly created Token documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Is a user able to update an existing Token?
   * @internal
   */
  static #canUpdate(user: User.Implementation, doc: BaseToken, data: BaseToken.UpdateData): boolean;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  updateSource(
    changes?: TokenDocument.CreateData,
    options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean },
  ): AnyObject;

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

  //TODO: Update with the Delta conditionality
  toObject(source: true): this["_source"];
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Token";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: TokenDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): TokenDocument.ImplementationClass;

  static get baseDocument(): typeof BaseToken;

  static get collectionName(): TokenDocument.ParentCollectionName;

  static get documentName(): TokenDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): false;

  static get hierarchy(): TokenDocument.Hierarchy;

  override parent: TokenDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TokenDocument.Implementation | TokenDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TokenDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TokenDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TokenDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TokenDocument.Database.Update>,
  ): Promise<TokenDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TokenDocument.Database.Delete>,
  ): Promise<TokenDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: TokenDocument.CreateData | TokenDocument.CreateData[],
    operation?: Document.Database.CreateOperation<TokenDocument.Database.Create<Temporary>>,
  ): Promise<TokenDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): TokenDocument.Implementation | null;

  // TODO: @LukeAbby More Implementation Nonsense
  // override getEmbeddedCollection<EmbeddedName extends TokenDocument.EmbeddedName>(
  //   embeddedName: EmbeddedName,
  // ): Document.EmbeddedCollectionFor<TokenDocument.Name, EmbeddedName>;

  // override getEmbeddedDocument<EmbeddedName extends TokenDocument.EmbeddedName>(
  //   embeddedName: EmbeddedName,
  //   id: string,
  //   options: Document.GetEmbeddedDocumentOptions, // TODO: Actually get the specific embedded name.
  // ): TokenDocument.Embedded | undefined;

  // override createEmbeddedDocuments<EmbeddedName extends TokenDocument.EmbeddedName>(
  //   embeddedName: EmbeddedName,
  //   data: Document.CreateDataFor<EmbeddedName>[] | undefined,
  //   // TODO: Generic over the EmbeddedName
  //   operation?: never,
  // ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>> | undefined>;

  // override updateEmbeddedDocuments<EmbeddedName extends TokenDocument.EmbeddedName>(
  //   embeddedName: EmbeddedName,
  //   updates: Document.UpdateDataFor<EmbeddedName>[] | undefined,
  //   // TODO: Generic over the EmbeddedName
  //   operation?: never,
  // ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>> | undefined>;

  // override deleteEmbeddedDocuments<EmbeddedName extends TokenDocument.EmbeddedName>(
  //   embeddedName: EmbeddedName,
  //   ids: Array<string>,
  //   // TODO: Generic over the EmbeddedName
  //   operation?: never,
  // ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends TokenDocument.Flags.Scope, Key extends TokenDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<TokenDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends TokenDocument.Flags.Scope,
    Key extends TokenDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<TokenDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends TokenDocument.Flags.Scope, Key extends TokenDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: TokenDocument.CreateData,
    options: TokenDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: TokenDocument.CreateData,
    options: TokenDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: TokenDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TokenDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: TokenDocument.UpdateData,
    options: TokenDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: TokenDocument.UpdateData,
    options: TokenDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: TokenDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: TokenDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<TokenDocument.Schema>;

  static get schema(): SchemaField<TokenDocument.Schema>;

  static validateJoint(data: TokenDocument.Source): void;

  static override fromSource(
    source: TokenDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<TokenDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<TokenDocument.Schema, DataModel.Any | null>;
}

/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField<
  DocumentType extends Document.AnyConstructor,
  Options extends fields.EmbeddedDocumentField.Options<DocumentType> = fields.EmbeddedDocumentField.DefaultOptions,
> extends fields.EmbeddedDocumentField<DocumentType, Options> {
  override initialize(
    value: fields.EmbeddedDocumentField.PersistedType<DocumentType, Options>,
    model: DataModel.Any,
    options?: InexactPartial<DataModel.DataValidationOptions>,
  ):
    | fields.EmbeddedDocumentField.InitializedType<DocumentType, Options>
    | (() => fields.EmbeddedDocumentField.InitializedType<DocumentType, Options> | null);
}

export default BaseToken;

declare namespace BaseToken {
  export import Name = TokenDocument.Name;
  export import ConstructorArgs = TokenDocument.ConstructorArgs;
  export import Hierarchy = TokenDocument.Hierarchy;
  export import Metadata = TokenDocument.Metadata;
  export import Parent = TokenDocument.Parent;
  export import Pack = TokenDocument.Pack;
  export import Embedded = TokenDocument.Embedded;
  export import EmbeddedName = TokenDocument.EmbeddedName;
  export import EmbeddedCollectionName = TokenDocument.EmbeddedCollectionName;
  export import ParentCollectionName = TokenDocument.ParentCollectionName;
  export import Stored = TokenDocument.Stored;
  export import Source = TokenDocument.Source;
  export import PersistedData = TokenDocument.PersistedData;
  export import CreateData = TokenDocument.CreateData;
  export import InitializedData = TokenDocument.InitializedData;
  export import UpdateData = TokenDocument.UpdateData;
  export import Schema = TokenDocument.Schema;
  export import DatabaseOperation = TokenDocument.Database;
  export import Flags = TokenDocument.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseToken.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseToken.CreateData | `BaseToken.CreateData`}
   */
  type ConstructorData = BaseToken.CreateData;
}

declare namespace ActorDeltaField {}
