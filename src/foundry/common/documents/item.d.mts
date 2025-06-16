import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseItem<out SubType extends Item.SubType = Item.SubType> extends Document<
  "Item",
  BaseItem._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseItem`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseItem` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Item.implementation | `new Item.implementation(...)`} instead which will give you
   * a system specific implementation of `Item`.
   */
  constructor(...args: Item.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Item",
   *   collection: "items",
   *   hasTypeData: true,
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"],
   *   embedded: {ActiveEffect: "effects"},
   *   label: "DOCUMENT.Item",
   *   labelPlural: "DOCUMENT.Items",
   *   permissions: {create: "ITEM_CREATE"},
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseItem.Metadata;

  static override defineSchema(): BaseItem.Schema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided item data.
   * @param itemData - The source item data
   * @returns Candidate item image
   * @remarks Core's implementation does not use `itemData`
   */
  static getDefaultArtwork(itemData?: BaseItem.CreateData): Item.GetDefaultArtworkReturn;

  /**
   * @remarks If `this.isEmbedded`, uses `this.parent.canUserModify(user, "update")`, dropping `data` and forcing `action`,
   * otherwise `super`'s (with all arguments forwarded). Core's `Actor` implementation doesn't override this method, so
   * without further extension those are both {@link Document.canUserModify | `Document#canUserModify`}
   */
  // data: not null (parameter default only)
  override canUserModify<Action extends "create" | "update" | "delete">(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<Item.Schema, Action>,
  ): boolean;

  /**
   * @remarks If `this.isEmbedded`, uses `this.parent.testUserPermission`, otherwise `super`'s. Core's `Actor` implementation
   * doesn't override this method, so without further extension those are both {@link Document.testUserPermission | `Document#testUserPermission`}
   */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

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
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: Item.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Item.ImplementationClass;

  static override get baseDocument(): typeof BaseItem;

  static override get collectionName(): Item.ParentCollectionName;

  static override get documentName(): Item.Name;

  static override get TYPES(): BaseItem.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Item.Hierarchy;

  override system: Item.SystemOfType<SubType>;

  override parent: BaseItem.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Item.Implementation | Item.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Item.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Item.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Item.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Item.Database.Update>,
  ): Promise<Item.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Item.Database.Delete>,
  ): Promise<Item.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Item.CreateData | Item.CreateData[],
    operation?: Item.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Item.Implementation, Temporary> | undefined>;

  override update(
    data: Item.UpdateData | undefined,
    operation?: Item.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Item.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Item.Database.GetOptions): Item.Implementation | null;

  static override getCollectionName<CollectionName extends Item.Embedded.Name>(
    name: CollectionName,
  ): Item.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Item.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Item.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Item.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Item.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Item.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Item.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Item.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Item.Flags.Scope, Key extends Item.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Item.Name, Scope, Key>;

  override setFlag<
    Scope extends Item.Flags.Scope,
    Key extends Item.Flags.Key<Scope>,
    Value extends Document.GetFlag<Item.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Item.Flags.Scope, Key extends Item.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Item.CreateData,
    options: Item.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(data: Item.CreateData, options: Item.Database.OnCreateOperation, userId: string): void;

  protected static override _preCreateOperation(
    documents: Item.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Item.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Item.Implementation[],
    operation: Item.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Item.UpdateData,
    options: Item.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Item.UpdateData,
    options: Item.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Item.Implementation[],
    operation: Item.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Item.Implementation[],
    operation: Item.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Item.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Item.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Item.Implementation[],
    operation: Item.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Item.Implementation[],
    operation: Item.Database.Delete,
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
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Item.Implementation[],
    context: Document.ModificationContext<Item.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Item.Schema>;

  static override get schema(): SchemaField<Item.Schema>;

  static override validateJoint(data: Item.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Item.CreateData, context?: DataModel.FromSourceOptions): Item.Implementation;

  static override fromJSON(json: string): Item.Implementation;
}

export default BaseItem;

declare namespace BaseItem {
  export import Name = Item.Name;
  export import ConstructorArgs = Item.ConstructorArgs;
  export import Hierarchy = Item.Hierarchy;
  export import Metadata = Item.Metadata;
  export import SubType = Item.SubType;
  export import ConfiguredSubTypes = Item.ConfiguredSubTypes;
  export import Known = Item.Known;
  export import OfType = Item.OfType;
  export import SystemOfType = Item.SystemOfType;
  export import Parent = Item.Parent;
  export import Descendant = Item.Descendant;
  export import DescendantClass = Item.DescendantClass;
  export import Pack = Item.Pack;
  export import Embedded = Item.Embedded;
  export import ParentCollectionName = Item.ParentCollectionName;
  export import CollectionClass = Item.CollectionClass;
  export import Collection = Item.Collection;
  export import Invalid = Item.Invalid;
  export import Stored = Item.Stored;
  export import Source = Item.Source;
  export import CreateData = Item.CreateData;
  export import InitializedData = Item.InitializedData;
  export import UpdateData = Item.UpdateData;
  export import Schema = Item.Schema;
  export import DatabaseOperation = Item.Database;
  export import Flags = Item.Flags;
  export import GetDefaultArtworkReturn = Item.GetDefaultArtworkReturn;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Item` a name.
    // The expression `ClientDocumentMixin(BaseItem)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseItem> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Item.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }
}
