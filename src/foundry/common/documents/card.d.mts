import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Card Document.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCard<out SubType extends BaseCard.SubType = BaseCard.SubType> extends Document<
  "Card",
  BaseCard._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseCard`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseCard` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Card.implementation | new Card.implementation(...)} instead which will give you
   * a system specific implementation of `Card`.
   */
  constructor(data: BaseCard.CreateData, context?: BaseCard.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Card",
   *   collection: "cards",
   *   hasTypeData: true,
   *   indexed: true,
   *   label: "DOCUMENT.Card",
   *   labelPlural: "DOCUMENT.Cards",
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate,
   *     delete: "OWNER"
   *   },
   *   compendiumIndexFields: ["name", "type", "suit", "sort"],
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseCard.Metadata;

  static override defineSchema(): BaseCard.Schema;

  /**
   * The default icon used for a Card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;

  /** @defaultValue `["DOCUMENT", "CARD"]` */
  static override LOCALIZATION_PREFIXES: string[];

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

  override readonly parentCollection: BaseCard.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Card.ImplementationClass;

  static override get baseDocument(): typeof BaseCard;

  static override get collectionName(): BaseCard.ParentCollectionName;

  static override get documentName(): BaseCard.Name;

  static override get TYPES(): BaseCard.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseCard.Hierarchy;

  override system: BaseCard.SystemOfType<SubType>;

  override parent: BaseCard.Parent;

  override " fvtt_types_internal_document_parent": BaseCard.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseCard.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseCard.Database.Create<Temporary>>,
  ): Promise<Array<BaseCard.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCard.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseCard.Database.Update>,
  ): Promise<Array<Card.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseCard.Database.Delete>,
  ): Promise<Array<Card.Stored>>;

  static override create<
    Data extends MaybeArray<BaseCard.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseCard.Database.CreateOperation<Temporary>,
  ): Promise<BaseCard.CreateReturn<Data, Temporary>>;

  override update(data: BaseCard.UpdateInput, operation?: BaseCard.Database.UpdateOperation): Promise<this | undefined>;

  override delete(operation?: BaseCard.Database.DeleteOperation): Promise<this | undefined>;

  // `Card`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseCard.Database.GetOptions): null;

  // `Card`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseCard.Flags.Scope, Key extends BaseCard.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCard.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCard.Flags.Scope,
    Key extends BaseCard.Flags.Key<Scope>,
    Value extends BaseCard.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseCard.Flags.Scope, Key extends BaseCard.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseCard.CreateData,
    options: BaseCard.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCard.CreateData,
    options: BaseCard.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Card.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseCard.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Card.Stored[],
    operation: BaseCard.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseCard.UpdateData,
    options: BaseCard.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseCard.UpdateData,
    options: BaseCard.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Card.Stored[],
    operation: BaseCard.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Card.Stored[],
    operation: BaseCard.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCard.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCard.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Card.Stored[],
    operation: BaseCard.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Card.Stored[],
    operation: BaseCard.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Card._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Card._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Card.Implementation[],
    context: BaseCard.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Card._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Card._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Card.Stored[],
    context: BaseCard.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Card._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Card._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Card.Stored[],
    context: BaseCard.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseCard.Schema>;

  static override get schema(): SchemaField<BaseCard.Schema>;

  static override validateJoint(data: BaseCard.Source): void;

  static override fromSource(source: BaseCard.CreateData, context?: DataModel.FromSourceOptions): Card.Implementation;

  static override fromJSON(json: string): Card.Implementation;

  static #BaseCard: true;
}

export default BaseCard;

declare namespace BaseCard {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Card.Name;
  export import ConstructionContext = Card.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Card.ConstructorArgs;
  export import Hierarchy = Card.Hierarchy;
  export import Metadata = Card.Metadata;
  export import SubType = Card.SubType;
  export import ConfiguredSubType = Card.ConfiguredSubType;
  export import Known = Card.Known;
  export import OfType = Card.OfType;
  export import SystemOfType = Card.SystemOfType;
  export import Parent = Card.Parent;
  export import Descendant = Card.Descendant;
  export import DescendantClass = Card.DescendantClass;
  export import Embedded = Card.Embedded;
  export import ParentCollectionName = Card.ParentCollectionName;
  export import CollectionClass = Card.CollectionClass;
  export import Collection = Card.Collection;
  export import Invalid = Card.Invalid;
  export import Source = Card.Source;
  export import CreateData = Card.CreateData;
  export import CreateInput = Card.CreateInput;
  export import CreateReturn = Card.CreateReturn;
  export import InitializedData = Card.InitializedData;
  export import UpdateData = Card.UpdateData;
  export import UpdateInput = Card.UpdateInput;
  export import Schema = Card.Schema;
  export import Database = Card.Database;
  export import TemporaryIf = Card.TemporaryIf;
  export import Flags = Card.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Card` a name.
    // The expression `ClientDocumentMixin(BaseCard)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseCard> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Card.Schema {
    system: any;
  }
}
