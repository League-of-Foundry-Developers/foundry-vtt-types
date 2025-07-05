import type { ConfiguredItem } from "fvtt-types/configuration";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { AnyObject, InexactPartial, Merge } from "#utils";
import type BaseItem from "#common/documents/item.mjs";

import fields = foundry.data.fields;

declare namespace Item {
  /**
   * The document's name.
   */
  type Name = "Item";

  /**
   * The context used to create a `Item`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Item`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Item` document instance configured through `CONFIG.Item.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredItem | `fvtt-types/configuration/ConfiguredItem`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Item` document configured through `CONFIG.Item.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "Item";
        collection: "items";
        hasTypeData: true;
        indexed: true;
        compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
        embedded: Metadata.Embedded;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      ActiveEffect: "effects";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation, data: CreateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Item`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Item.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Item">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Item">;

  /**
   * `Known` represents the types of `Item` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = Item.OfType<Item.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `Item` with the corresponding type. This works with both the
   * builtin `Item` class or a custom subclass if that is set up in
   * {@link ConfiguredItem | `fvtt-types/configuration/ConfiguredItem`}.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredItem<Type>, () => Item<Type>>;

  /**
   * `SystemOfType` returns the system property for a specific `Item` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<"Item"> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = ActiveEffect.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = ActiveEffect.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Actor" | "Item">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      Item.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `Item`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Items.ConfiguredClass;

  /**
   * The world collection that contains `Item`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Items.Configured;

  /**
   * An instance of `Item` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<Implementation> {}

  /**
   * An instance of `Item` that comes from the database.
   */
  type Stored<SubType extends Item.SubType = Item.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@link Item._source | `Item#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Item.create}
   * and {@link Item | `new Item(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Item.name | `Item#name`}.
   *
   * This is data transformed from {@linkcode Item.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Item.update | `Item#update`}.
   * It is a distinct type from {@link Item.CreateData | `DeepPartial<Item.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Item}. This is the source of truth for how an Item document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Item}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Item document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Item */
    name: fields.StringField<
      { required: true; blank: false; textSearch: true },
      // Note(LukeAbby): Field override because `blank: false` isn't fully accounted for or something.
      string,
      string,
      string
    >;

    /** An Item subtype which configures the system data model applied */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof documents.BaseItem, {}, Item.SubType, Item.SubType, Item.SubType>;

    /**
     * An image file path which provides the artwork for this Item
     * @defaultValue `null`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: (data: unknown) => string;
    }>;

    /**
     * Data for an Item subtype, defined by a System or Module
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof documents.BaseItem>;

    /**
     * A collection of ActiveEffect embedded Documents
     * @defaultValue `[]`
     */
    effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, Item.Implementation>;

    /**
     * The _id of a Folder which contains this Item
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Item relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Item
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for Items */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Item.Parent> {}

    /** Options passed along in Create operations for Items */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Item.CreateData, Item.Parent, Temporary> {}

    /** Options passed along in Delete operations for Items */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Item.Parent> {}

    /** Options passed along in Update operations for Items */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Item.UpdateData, Item.Parent> {}

    /** Operation for {@linkcode Item.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Item.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Item.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Item.Database.Update> {}

    /** Operation for {@linkcode Item.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Item.Database.Delete> {}

    /** Operation for {@linkcode Item.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Item.Database.Create<Temporary>> {}

    /** Operation for {@link Item.update | `Item#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Item.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Item._preCreate | `Item#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Item._onCreate | `Item#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Item._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Item.Database.Create> {}

    /** Operation for {@link Item._onCreateOperation | `Item#_onCreateOperation`} */
    interface OnCreateOperation extends Item.Database.Create {}

    /** Options for {@link Item._preUpdate | `Item#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Item._onUpdate | `Item#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Item._preUpdateOperation} */
    interface PreUpdateOperation extends Item.Database.Update {}

    /** Operation for {@link Item._onUpdateOperation | `Item._preUpdateOperation`} */
    interface OnUpdateOperation extends Item.Database.Update {}

    /** Options for {@link Item._preDelete | `Item#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Item._onDelete | `Item#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Item._preDeleteOperation | `Item#_preDeleteOperation`} */
    interface PreDeleteOperation extends Item.Database.Delete {}

    /** Options for {@link Item._onDeleteOperation | `Item#_onDeleteOperation`} */
    interface OnDeleteOperation extends Item.Database.Delete {}

    /** Context for {@linkcode Item._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Item.Parent> {}

    /** Context for {@linkcode Item._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Item.Parent> {}

    /** Context for {@linkcode Item._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Item.Parent> {}

    /**
     * Options for {@link Item._preCreateDescendantDocuments | `Item#_preCreateDescendantDocuments`}
     * and {@link Item._onCreateDescendantDocuments | `Item#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Item.Database.Create> {}

    /**
     * Options for {@link Item._preUpdateDescendantDocuments | `Item#_preUpdateDescendantDocuments`}
     * and {@link Item._onUpdateDescendantDocuments | `Item#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Item.Database.Update> {}

    /**
     * Options for {@link Item._preDeleteDescendantDocuments | `Item#_preDeleteDescendantDocuments`}
     * and {@link Item._onDeleteDescendantDocuments | `Item#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Item.Database.Delete> {}

    /**
     * Create options for {@linkcode Item.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `Item.Implementation`, otherwise `Item.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary ? Item.Implementation : Item.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
    Item.Stored,
    Item.DirectDescendant,
    Item.Metadata.Embedded
  >;

  interface GetDefaultArtworkReturn {
    /** @defaultValue `Item.DEFAULT_ICON` */
    img: string;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Item document which extends the common BaseItem abstraction.
 * Each Item document contains ItemData which defines its data schema.
 *
 * @see {@linkcode Items}            The world-level collection of Item documents
 * @see {@linkcode ItemSheet}     The Item configuration application
 *
 * @param data    - Initial data provided to construct the Item document
 * @param context - The document context, see {@linkcode foundry.abstract.Document}
 */
declare class Item<out SubType extends Item.SubType = Item.SubType> extends BaseItem.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Item`
   * @param context - Construction context options
   */
  constructor(data: Item.CreateData, context?: Item.ConstructionContext);

  /**
   * A convenience alias of Item#parent which is more semantically intuitive
   */
  get actor(): Actor.Implementation | null;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string;

  /**
   * A convenience alias of Item#isEmbedded which is preserves legacy support
   */
  get isOwned(): boolean;

  /**
   * Return an array of the Active Effect instances which originated from this Item.
   * The returned instances are the ActiveEffect instances which exist on the Item itself.
   */
  get transferredEffects(): ActiveEffect.Implementation[];

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @remarks defaults to this.system, but provided as object for flexible overrides
   */
  getRollData(): AnyObject;

  // _preCreate, _onCreateOperation and _onDeleteOperation are all overridden but with no signature changes from BaseItem.

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeItem extends Item {
   *   protected override _preCreateDescendantDocuments(...args: Item.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: Item.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsItem extends Item {
   *   protected override _onCreateDescendantDocuments(...args: Item.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: Item.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerItem extends Item {
   *   protected override _preUpdateDescendantDocuments(...args: Item.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: Item.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eItem extends Item {
   *   protected override _onUpdateDescendantDocuments(...args: Item.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: Item.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultItem extends Item {
   *   protected override _preDeleteDescendantDocuments(...args: Item.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: Item.PreDeleteDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesItem extends Item {
   *   protected override _onDeleteDescendantDocuments(...args: Item.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: Item.OnDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Item.DefaultNameContext): string;

  static override createDialog(
    data?: Item.CreateDialogData,
    createOptions?: Item.Database.DialogCreateOptions,
    options?: Item.CreateDialogOptions,
  ): Promise<Item.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Item">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: Item.DropData,
    options?: Item.DropDataOptions,
  ): Promise<Item.Implementation | undefined>;

  static override fromImport(
    source: Item.Source,
    context?: Document.FromImportContext<Item.Parent> | null,
  ): Promise<Item.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Item;
