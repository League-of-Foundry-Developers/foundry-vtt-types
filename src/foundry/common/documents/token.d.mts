import type { AnyMutableObject } from "fvtt-types/utils";
import type { DataModel } from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.d.mts";
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

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Token",
   *   collection: "tokens",
   *   label: "DOCUMENT.Token",
   *   labelPlural: "DOCUMENT.Tokens",
   *   isEmbedded: true,
   *   embedded: {
   *     ActorDelta: "delta"
   *   },
   *   permissions: {
   *     create: "TOKEN_CREATE",
   *     update: this.#canUpdate,
   *     delete: "TOKEN_DELETE"
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseToken.Metadata;

  static override defineSchema(): BaseToken.Schema;

  /**
   * The default icon used for newly created Token documents
   * @defaultValue `CONST.DEFAULT_TOKEN` (`"icons/svg/mystery-man.svg"`)
   */
  static DEFAULT_ICON: string;

  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  updateSource(changes?: TokenDocument.UpdateData, options?: DataModel.UpdateOptions): TokenDocument.UpdateData;

  // TODO: Update with the Delta conditionality
  toObject(source: true): this["_source"];
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

  /**
   * @remarks Migrates:
   * - `actorData` to `delta`
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks Shims:
   * - `actorData` to `delta` since v11, until v13
   * - `effects` to nothing since v12, until v14 ("TokenDocument#effects is deprecated in favor of using ActiveEffect documents on the associated Actor")
   * - `overlayEffect` to nothing since v12, until v14 ("TokenDocument#overlayEffect is deprecated in favor of using ActiveEffect documents on the associated Actor")
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until v14
   * @remarks "TokenDocument#overlayEffect is deprecated in favor of using ActiveEffect documents on the associated Actor"
   */
  get effects(): [];

  /**
   * @deprecated since v12, until v14
   * @remarks "TokenDocument# is deprecated in favor of using ActiveEffect documents on the associated Actor"
   */
  get overlayEffect(): "";

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

  static get hasTypeData(): undefined;

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

  static override create<Temporary extends boolean | undefined = false>(
    data: TokenDocument.CreateData | TokenDocument.CreateData[],
    operation?: TokenDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<TokenDocument.Implementation, Temporary> | undefined>;

  override update(
    data: TokenDocument.UpdateData | undefined,
    operation?: TokenDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: TokenDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: TokenDocument.Database.GetOptions,
  ): TokenDocument.Implementation | null;

  static override getCollectionName<CollectionName extends TokenDocument.Embedded.Name>(
    name: CollectionName,
  ): TokenDocument.Embedded.CollectionNameOf<CollectionName> | null;

  /**
   * @remarks Calling `BaseToken#getEmbeddedCollection` would result in entirely typical results at
   * runtime, namely returning a `EmbeddedCollection` corresponding to a field in `BaseToken`'s
   * schema. However {@link TokenDocument.getEmbeddedCollection | `TokenDocument#getEmbeddedCollection`}
   * is overridden to add new cases and since `BaseToken` is a superclass it had to be widened to
   * accomodate that.
   */
  override getEmbeddedCollection(embeddedName: TokenDocument.Embedded.CollectionName): Collection.Any;

  override getEmbeddedDocument<EmbeddedName extends TokenDocument.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): TokenDocument.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends TokenDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends TokenDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends TokenDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

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

  /* DataModel overrides */

  protected static _schema: SchemaField<TokenDocument.Schema>;

  static get schema(): SchemaField<TokenDocument.Schema>;

  static validateJoint(data: TokenDocument.Source): void;

  // context: not null (destructured)
  static override fromSource(
    source: TokenDocument.CreateData,
    context?: Document.ConstructionContext<BaseToken.Parent>,
  ): TokenDocument.Implementation;

  static override fromJSON(json: string): TokenDocument.Implementation;
}

/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField<
  DocumentType extends Document.AnyConstructor,
  Options extends fields.EmbeddedDocumentField.Options<DocumentType> = fields.EmbeddedDocumentField.DefaultOptions,
> extends fields.EmbeddedDocumentField<DocumentType, Options> {
  // options: not null (parameter default only)
  override initialize(
    value: fields.EmbeddedDocumentField.PersistedType<DocumentType, Options>,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
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
  export import Descendant = TokenDocument.Descendant;
  export import DescendantClass = TokenDocument.DescendantClass;
  export import Pack = TokenDocument.Pack;
  export import Embedded = TokenDocument.Embedded;
  export import ParentCollectionName = TokenDocument.ParentCollectionName;
  export import CollectionClass = TokenDocument.CollectionClass;
  export import Collection = TokenDocument.Collection;
  export import Invalid = TokenDocument.Invalid;
  export import Stored = TokenDocument.Stored;
  export import Source = TokenDocument.Source;
  export import PersistedData = TokenDocument.PersistedData;
  export import CreateData = TokenDocument.CreateData;
  export import InitializedData = TokenDocument.InitializedData;
  export import UpdateData = TokenDocument.UpdateData;
  export import Schema = TokenDocument.Schema;
  export import DatabaseOperation = TokenDocument.Database;
  export import Flags = TokenDocument.Flags;
  export import CoreFlags = TokenDocument.CoreFlags;

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
