import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @deprecated Constructing `BaseCards` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Cards.implementation | `new Cards.implementation(...)`} instead which will give you
   * a system specific implementation of `Cards`.
   */
  constructor(...args: Cards.ConstructorArgs);

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
   *   permissions: {create: "CARDS_CREATE"},
   *   coreTypes: ["deck", "hand", "pile"],
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseCards.Metadata;

  static override defineSchema(): BaseCards.Schema;

  /**
   * The default icon used for a cards stack that does not have a custom image set
   * @defaultValue `"icons/svg/card-hand.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

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

  override readonly parentCollection: Cards.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Cards.ImplementationClass;

  static override get baseDocument(): typeof BaseCards;

  static override get collectionName(): Cards.ParentCollectionName;

  static override get documentName(): Cards.Name;

  static override get TYPES(): BaseCards.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Cards.Hierarchy;

  override system: Cards.SystemOfType<SubType>;

  override parent: BaseCards.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Cards.Implementation | Cards.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Cards.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Cards.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Cards.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Cards.Database.Update>,
  ): Promise<Cards.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Cards.Database.Delete>,
  ): Promise<Cards.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Cards.CreateData | Cards.CreateData[],
    operation?: Cards.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Cards.Implementation, Temporary> | undefined>;

  override update(
    data: Cards.UpdateData | undefined,
    operation?: Cards.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Cards.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Cards.Database.GetOptions): Cards.Implementation | null;

  static override getCollectionName<CollectionName extends Cards.Embedded.Name>(
    name: CollectionName,
  ): Cards.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Cards.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Cards.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Cards.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Cards.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Cards.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Cards.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Cards.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Cards.Flags.Scope, Key extends Cards.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Cards.Name, Scope, Key>;

  override setFlag<
    Scope extends Cards.Flags.Scope,
    Key extends Cards.Flags.Key<Scope>,
    Value extends Document.GetFlag<Cards.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Cards.Flags.Scope, Key extends Cards.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Cards.CreateData,
    options: Cards.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(data: Cards.CreateData, options: Cards.Database.OnCreateOperation, userId: string): void;

  protected static override _preCreateOperation(
    documents: Cards.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Cards.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Cards.Implementation[],
    operation: Cards.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Cards.UpdateData,
    options: Cards.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Cards.UpdateData,
    options: Cards.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Cards.Implementation[],
    operation: Cards.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Cards.Implementation[],
    operation: Cards.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Cards.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Cards.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Cards.Implementation[],
    operation: Cards.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Cards.Implementation[],
    operation: Cards.Database.Delete,
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
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Cards.Schema>;

  static override get schema(): SchemaField<Cards.Schema>;

  static override validateJoint(data: Cards.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Cards.CreateData, context?: DataModel.FromSourceOptions): Cards.Implementation;

  static override fromJSON(json: string): Cards.Implementation;
}

export default BaseCards;

declare namespace BaseCards {
  export import Name = Cards.Name;
  export import ConstructorArgs = Cards.ConstructorArgs;
  export import Hierarchy = Cards.Hierarchy;
  export import Metadata = Cards.Metadata;
  export import SubType = Cards.SubType;
  export import ConfiguredSubTypes = Cards.ConfiguredSubTypes;
  export import Known = Cards.Known;
  export import OfType = Cards.OfType;
  export import SystemOfType = Cards.SystemOfType;
  export import Parent = Cards.Parent;
  export import Descendant = Cards.Descendant;
  export import DescendantClass = Cards.DescendantClass;
  export import Pack = Cards.Pack;
  export import Embedded = Cards.Embedded;
  export import ParentCollectionName = Cards.ParentCollectionName;
  export import CollectionClass = Cards.CollectionClass;
  export import Collection = Cards.Collection;
  export import Invalid = Cards.Invalid;
  export import Stored = Cards.Stored;
  export import Source = Cards.Source;
  export import CreateData = Cards.CreateData;
  export import InitializedData = Cards.InitializedData;
  export import UpdateData = Cards.UpdateData;
  export import Schema = Cards.Schema;
  export import DatabaseOperation = Cards.Database;
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
