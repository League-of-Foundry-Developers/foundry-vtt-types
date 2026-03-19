import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
/** @privateRemarks `DocumentStatsField` only used for links. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DocumentStatsField, SchemaField } from "../data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActor<out SubType extends BaseActor.SubType = BaseActor.SubType> extends Document<
  "Actor",
  BaseActor._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseActor`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseActor` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Actor.implementation | `new Actor.implementation(...)`} instead which will give you
   * a system specific implementation of `Actor`.
   */
  constructor(data: BaseActor.CreateData, context?: BaseActor.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Actor",
   *   collection: "actors",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"],
   *   embedded: {ActiveEffect: "effects", Item: "items"},
   *   hasTypeData: true,
   *   label: "DOCUMENT.Actor",
   *   labelPlural: "DOCUMENT.Actors",
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseActor.Metadata;

  static override defineSchema(): BaseActor.Schema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue {@linkcode CONST.DEFAULT_TOKEN}
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data
   * @param actorData - The source actor data
   * @remarks Foundry's implementation does not use `actorData`, but does mark it required, because it is always passed document source when
   * called by core.
   */
  static getDefaultArtwork(actorData?: BaseActor.CreateData): BaseActor.GetDefaultArtworkReturn;

  protected override _initializeSource(
    data: BaseActor.CreateData | this,
    options?: Document.InitializeSourceOptions,
  ): BaseActor.Source;

  /** @remarks Calls {@linkcode DocumentStatsField._shimDocument}`(this)` */
  protected override _initialize(options?: Document.InitializeOptions): void;

  static override canUserCreate(user: User.Implementation): boolean;

  protected override _preCreate(
    data: BaseActor.CreateData,
    options: BaseActor.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _preUpdate(
    changed: BaseActor.UpdateData,
    options: BaseActor.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  /** @remarks Calls {@linkcode DocumentStatsField._migrateData}`(this, source)` */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks Calls {@linkcode DocumentStatsField._shimData}`(this, source, options)` */
  static override shimData(source: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseActor.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Actor.ImplementationClass;

  static override get baseDocument(): typeof BaseActor;

  static override get collectionName(): BaseActor.ParentCollectionName;

  static override get documentName(): BaseActor.Name;

  static override get TYPES(): BaseActor.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseActor.Hierarchy;

  override system: BaseActor.SystemOfType<SubType>;

  override parent: BaseActor.Parent;

  override " fvtt_types_internal_document_parent": BaseActor.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseActor.CreateInput[],
    operation?: BaseActor.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseActor.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseActor.UpdateInput[],
    operation?: BaseActor.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Actor.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseActor.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Actor.Stored>>;

  static override create<
    Data extends MaybeArray<BaseActor.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseActor.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseActor.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseActor.UpdateInput,
    operation?: BaseActor.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseActor.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseActor.Database.GetDocumentsOperation,
  ): Actor.Implementation | CompendiumCollection.IndexEntry<"Actor"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseActor.Embedded.CollectionName>,
  ): BaseActor.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseActor.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseActor.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseActor.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseActor.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseActor.Flags.Scope, Key extends BaseActor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseActor.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseActor.Flags.Scope,
    Key extends BaseActor.Flags.Key<Scope>,
    Value extends BaseActor.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseActor.Flags.Scope, Key extends BaseActor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _onCreate(
    data: BaseActor.CreateData,
    options: BaseActor.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Actor.Implementation[],
    operation: BaseActor.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _onUpdate(
    changed: BaseActor.UpdateData,
    options: BaseActor.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseActor.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseActor.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Actor.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActor.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Actor.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActor.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Actor.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActor.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseActor.Schema>;

  static override get schema(): SchemaField<BaseActor.Schema>;

  static override validateJoint(data: BaseActor.Source): void;

  static override fromSource(source: BaseActor.CreateData, context?: DataModel.FromSourceOptions): Actor.Implementation;

  static override fromJSON(json: string): Actor.Implementation;

  static #BaseActor: true;
}

declare namespace BaseActor {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Actor.Name;
  export import ConstructionContext = Actor.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Actor.ConstructorArgs;
  export import Hierarchy = Actor.Hierarchy;
  export import Metadata = Actor.Metadata;
  export import SubType = Actor.SubType;
  export import ConfiguredSubType = Actor.ConfiguredSubType;
  export import Known = Actor.Known;
  export import OfType = Actor.OfType;
  export import SystemOfType = Actor.SystemOfType;
  export import Parent = Actor.Parent;
  export import Descendant = Actor.Descendant;
  export import DescendantClass = Actor.DescendantClass;
  export import Embedded = Actor.Embedded;
  export import ParentCollectionName = Actor.ParentCollectionName;
  export import CollectionClass = Actor.CollectionClass;
  export import Collection = Actor.Collection;
  export import Invalid = Actor.Invalid;
  export import Source = Actor.Source;
  export import CreateData = Actor.CreateData;
  export import CreateInput = Actor.CreateInput;
  export import CreateReturn = Actor.CreateReturn;
  export import InitializedData = Actor.InitializedData;
  export import UpdateData = Actor.UpdateData;
  export import UpdateInput = Actor.UpdateInput;
  export import Schema = Actor.Schema;
  export import Database = Actor.Database;
  export import TemporaryIf = Actor.TemporaryIf;
  export import Flags = Actor.Flags;
  export import GetDefaultArtworkReturn = Actor.GetDefaultArtworkReturn;
  export import GetDefaultArtworkTextureReturn = Actor.GetDefaultArtworkTextureReturn;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Actor` a name.
    // The expression `ClientDocumentMixin(BaseActor)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseActor> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Actor.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }
}

export default BaseActor;
