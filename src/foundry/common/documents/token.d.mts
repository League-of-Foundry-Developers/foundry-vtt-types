import type { AnyMutableObject } from "#utils";
import type { DataModel } from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/_module.d.mts";
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
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * @remarks If `this.actor`, uses {@link Actor.testUserPermission | `this.actor.testUserPermission`} otherwise `super`'s. Core's `Actor` implementation
   * doesn't override this method, so without further extension, that's equivalent to {@link Document.testUserPermission | `Document#testUserPermission`}
   */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  // changes, options: not null (parameter default only)
  override updateSource(
    changes?: TokenDocument.UpdateData,
    options?: DataModel.UpdateOptions,
  ): TokenDocument.UpdateData;

  // TODO: Update with the Delta conditionality
  override toObject(source?: boolean | null): TokenDocument.Source;

  /**
   * @remarks
   * Migrations:
   * - `actorData` to `delta` (since v11, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `actorData` to `delta` (since v11, until v13)
   * - `effects` to nothing (since v12, until v14)
   *   - "`TokenDocument#effects` is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated `Actor`")
   * - `overlayEffect` to nothing (since v12, until v14)
   *   - "`TokenDocument#overlayEffect` is deprecated in favor of using `ActiveEffect` documents on the associated `Actor`")
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until v14
   * @remarks "TokenDocument#overlayEffect is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated Actor"
   */
  get effects(): [];

  /**
   * @deprecated since v12, until v14
   * @remarks "TokenDocument# is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated Actor"
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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: TokenDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): TokenDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseToken;

  static override get collectionName(): TokenDocument.ParentCollectionName;

  static override get documentName(): TokenDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): TokenDocument.Hierarchy;

  override parent: TokenDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TokenDocument.Implementation | TokenDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TokenDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TokenDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: TokenDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TokenDocument.Database.Update>,
  ): Promise<TokenDocument.Implementation[]>;

  static override deleteDocuments(
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
   * accommodate that.
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
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends TokenDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends TokenDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

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

  protected override _preCreate(
    data: TokenDocument.CreateData,
    options: TokenDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: TokenDocument.CreateData,
    options: TokenDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TokenDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TokenDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: TokenDocument.UpdateData,
    options: TokenDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: TokenDocument.UpdateData,
    options: TokenDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: TokenDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: TokenDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TokenDocument.Implementation[],
    operation: TokenDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
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

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: TokenDocument.Implementation[],
    context: Document.ModificationContext<TokenDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<TokenDocument.Schema>;

  static override get schema(): SchemaField<TokenDocument.Schema>;

  static override validateJoint(data: TokenDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: TokenDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TokenDocument.Implementation;

  static override fromJSON(json: string): TokenDocument.Implementation;

  static #BaseToken: true;
}

/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField<
  DocumentType extends foundry.documents.BaseActorDelta.AnyConstructor,
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
  export import CreateData = TokenDocument.CreateData;
  export import InitializedData = TokenDocument.InitializedData;
  export import UpdateData = TokenDocument.UpdateData;
  export import Schema = TokenDocument.Schema;
  export import DatabaseOperation = TokenDocument.Database;
  export import Flags = TokenDocument.Flags;
  export import CoreFlags = TokenDocument.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `TokenDocument` a name.
    // The expression `CanvasDocumentMixin(BaseToken)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseToken> {}
    const CanvasDocument: CanvasDocument;
  }
}
