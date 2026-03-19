import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Cards Document.
 * Defines the DataSchema and common behaviors for a Cards Document which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCards<out SubType extends BaseCards.SubType = BaseCards.SubType> extends Document<
  "Cards",
  BaseCards._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseCards`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseCards` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Cards.implementation | `new Cards.implementation(...)`} instead which will give you
   * a system specific implementation of `Cards`.
   */
  constructor(data: BaseCards.CreateData, context?: BaseCards.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * super.metadata, {
   *   name: "Cards",
   *   collection: "cards",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "description", "img", "type", "sort", "folder"],
   *   embedded: {Card: "cards"},
   *   hasTypeData: true,
   *   label: "DOCUMENT.Cards",
   *   labelPlural: "DOCUMENT.CardsPlural",
   *   permissions: {
   *     create: "CARDS_CREATE",
   *     delete: "OWNER"
   *   },
   *   coreTypes: ["deck", "hand", "pile"],
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseCards.Metadata;

  static override defineSchema(): BaseCards.Schema;

  /** @defaultValue `["DOCUMENT", "CARDS"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for a cards stack that does not have a custom image set
   * @defaultValue `"icons/svg/card-hand.svg"`
   */
  static DEFAULT_ICON: string;

  /** @remarks Calls {@linkcode DocumentStatsField._shimDocument}`(this)` */
  protected override _initialize(options?: Document.InitializeOptions): void;

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

  override readonly parentCollection: BaseCards.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Cards.ImplementationClass;

  static override get baseDocument(): typeof BaseCards;

  static override get collectionName(): BaseCards.ParentCollectionName;

  static override get documentName(): BaseCards.Name;

  static override get TYPES(): BaseCards.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseCards.Hierarchy;

  override system: BaseCards.SystemOfType<SubType>;

  override parent: BaseCards.Parent;

  override " fvtt_types_internal_document_parent": BaseCards.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseCards.CreateInput[],
    operation?: BaseCards.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseCards.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCards.UpdateInput[],
    operation?: BaseCards.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Cards.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseCards.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Cards.Stored>>;

  static override create<
    Data extends MaybeArray<BaseCards.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseCards.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseCards.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseCards.UpdateInput,
    operation?: BaseCards.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseCards.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseCards.Database.GetDocumentsOperation,
  ): Cards.Stored | CompendiumCollection.IndexEntry<"Cards"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseCards.Embedded.CollectionName>,
  ): BaseCards.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseCards.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseCards.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseCards.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseCards.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseCards.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseCards.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseCards.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseCards.Flags.Scope, Key extends BaseCards.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCards.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCards.Flags.Scope,
    Key extends BaseCards.Flags.Key<Scope>,
    Value extends BaseCards.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseCards.Flags.Scope, Key extends BaseCards.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseCards.CreateData,
    options: BaseCards.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCards.CreateData,
    options: BaseCards.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Cards.Implementation[],
    operation: BaseCards.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Cards.Stored[],
    operation: BaseCards.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseCards.UpdateData,
    options: BaseCards.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseCards.UpdateData,
    options: BaseCards.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Cards.Stored[],
    operation: BaseCards.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Cards.Stored[],
    operation: BaseCards.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCards.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCards.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Cards.Stored[],
    operation: BaseCards.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Cards.Stored[],
    operation: BaseCards.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Cards.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCards.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Cards.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCards.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Cards.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCards.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseCards.Schema>;

  static override get schema(): SchemaField<BaseCards.Schema>;

  static override validateJoint(data: BaseCards.Source): void;

  static override fromSource(source: BaseCards.CreateData, context?: DataModel.FromSourceOptions): Cards.Implementation;

  static override fromJSON(json: string): Cards.Implementation;
}

export default BaseCards;

declare namespace BaseCards {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Cards.Name;
  export import ConstructionContext = Cards.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Cards.ConstructorArgs;
  export import Hierarchy = Cards.Hierarchy;
  export import Metadata = Cards.Metadata;
  export import SubType = Cards.SubType;
  export import ConfiguredSubType = Cards.ConfiguredSubType;
  export import Known = Cards.Known;
  export import OfType = Cards.OfType;
  export import SystemOfType = Cards.SystemOfType;
  export import Parent = Cards.Parent;
  export import Descendant = Cards.Descendant;
  export import DescendantClass = Cards.DescendantClass;
  export import Embedded = Cards.Embedded;
  export import ParentCollectionName = Cards.ParentCollectionName;
  export import CollectionClass = Cards.CollectionClass;
  export import Collection = Cards.Collection;
  export import Invalid = Cards.Invalid;
  export import Source = Cards.Source;
  export import CreateData = Cards.CreateData;
  export import CreateInput = Cards.CreateInput;
  export import CreateReturn = Cards.CreateReturn;
  export import InitializedData = Cards.InitializedData;
  export import UpdateData = Cards.UpdateData;
  export import UpdateInput = Cards.UpdateInput;
  export import Schema = Cards.Schema;
  export import Database = Cards.Database;
  export import TemporaryIf = Cards.TemporaryIf;
  export import Flags = Cards.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Cards` a name.
    // The expression `ClientDocumentMixin(BaseCards)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseCards> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Cards.Schema {
    system: any;
  }
}
