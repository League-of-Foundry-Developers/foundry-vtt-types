import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @deprecated Constructing `BaseCard` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Card.implementation | `new Card.implementation(...)`} instead which will give you
   * a system specific implementation of `Card`.
   */
  constructor(...args: Card.ConstructorArgs);

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

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: Card.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Card.ImplementationClass;

  static override get baseDocument(): typeof BaseCard;

  static override get collectionName(): Card.ParentCollectionName;

  static override get documentName(): Card.Name;

  static override get TYPES(): BaseCard.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Card.Hierarchy;

  override system: Card.SystemOfType<SubType>;

  override parent: BaseCard.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Card.Implementation | Card.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Card.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Card.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Card.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Card.Database.Update>,
  ): Promise<Card.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Card.Database.Delete>,
  ): Promise<Card.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Card.CreateData | Card.CreateData[],
    operation?: Card.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Card.Implementation, Temporary> | undefined>;

  override update(
    data: Card.UpdateData | undefined,
    operation?: Card.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Card.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Card.Database.GetOptions): Card.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Card.Flags.Scope, Key extends Card.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Card.Name, Scope, Key>;

  override setFlag<
    Scope extends Card.Flags.Scope,
    Key extends Card.Flags.Key<Scope>,
    Value extends Document.GetFlag<Card.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Card.Flags.Scope, Key extends Card.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Card.CreateData,
    options: Card.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(data: Card.CreateData, options: Card.Database.OnCreateOperation, userId: string): void;

  protected static override _preCreateOperation(
    documents: Card.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Card.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Card.UpdateData,
    options: Card.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Card.UpdateData,
    options: Card.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Card.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Card.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Delete,
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
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Card.Schema>;

  static override get schema(): SchemaField<Card.Schema>;

  static override validateJoint(data: Card.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Card.CreateData, context?: DataModel.FromSourceOptions): Card.Implementation;

  static override fromJSON(json: string): Card.Implementation;

  static #BaseCard: true;
}

export default BaseCard;

declare namespace BaseCard {
  export import Name = Card.Name;
  export import ConstructorArgs = Card.ConstructorArgs;
  export import Hierarchy = Card.Hierarchy;
  export import Metadata = Card.Metadata;
  export import SubType = Card.SubType;
  export import ConfiguredSubTypes = Card.ConfiguredSubTypes;
  export import Known = Card.Known;
  export import OfType = Card.OfType;
  export import SystemOfType = Card.SystemOfType;
  export import Parent = Card.Parent;
  export import Descendant = Card.Descendant;
  export import DescendantClass = Card.DescendantClass;
  export import Pack = Card.Pack;
  export import Embedded = Card.Embedded;
  export import ParentCollectionName = Card.ParentCollectionName;
  export import CollectionClass = Card.CollectionClass;
  export import Collection = Card.Collection;
  export import Invalid = Card.Invalid;
  export import Stored = Card.Stored;
  export import Source = Card.Source;
  export import CreateData = Card.CreateData;
  export import InitializedData = Card.InitializedData;
  export import UpdateData = Card.UpdateData;
  export import Schema = Card.Schema;
  export import DatabaseOperation = Card.Database;
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
