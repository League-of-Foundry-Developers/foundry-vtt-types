import type { ConfiguredItem } from "../../../../configuration/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { AnyObject } from "fvtt-types/utils";

declare global {
  namespace Item {
    /**
     * The document's name.
     */
    type Name = "Item";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within Item.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the Item document instance configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredItem | `fvtt-types/configuration/ConfiguredItem`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the Item document configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<Name>;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<Name> {}

    type SubType = Game.Model.TypeNames<Name>;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<Name>;
    type Known = Item.OfType<Item.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredItem<Type>, Item<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.Implementation | null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendants = ActiveEffect.Stored;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = ActiveEffect.ImplementationClass;

    /**
     * Types of CompendiumCollection this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    type Pack = CompendiumCollection.ForDocument<"Actor" | "Item">;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = Document.ImplementationFor<EmbeddedName>;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type EmbeddedName = Document.EmbeddableNamesFor<Metadata>;

    type CollectionNameOf<CollectionName extends EmbeddedName> = CollectionName extends keyof Metadata["embedded"]
      ? Metadata["embedded"][CollectionName]
      : CollectionName;

    type EmbeddedCollectionName = Document.CollectionNamesFor<Metadata>;

    /**
     * The name of the world or embedded collection this document can find itself in.
     * For example an `Item` is always going to be inside a collection with a key of `items`.
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
     */
    type ParentCollectionName = Metadata["collection"];

    /**
     * An instance of `Item` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link Item._source | `Item#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Item._source | `Item#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Item.create | `Item.create`}
     * and {@link Item | `new Item(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link Item.name | `Item#name`}.
     *
     * This is data transformed from {@link Item.Source | `Item.Source`} and turned into more
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
     * The schema for {@link Item | `Item`}. This is the source of truth for how an Item document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Item | `Item`}. For example
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
      name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

      /** An Item subtype which configures the system data model applied */
      type: fields.DocumentTypeField<typeof documents.BaseItem>;

      /**
       * An image file path which provides the artwork for this Item
       * @defaultValue `null`
       */
      img: fields.FilePathField<{
        categories: "IMAGE"[];
        initial: (data: unknown) => string;
      }>;

      /**
       * The system data object which is defined by the system template.json model
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
       * @defaultValue see {@link fields.DocumentOwnershipField | `fields.DocumentOwnershipField`}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
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

      /** Operation for {@link Item.createDocuments | `Item.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Item.Database.Create<Temporary>> {}

      /** Operation for {@link Item.updateDocuments | `Item.updateDocuments`} */
      interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Item.Database.Update> {}

      /** Operation for {@link Item.deleteDocuments | `Item.deleteDocuments`} */
      interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Item.Database.Delete> {}

      /** Operation for {@link Item.create | `Item.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Item.Database.Create<Temporary>> {}

      /** Operation for {@link Item.update | `Item#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link Item.get | `Item.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link Item._preCreate | `Item#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link Item._onCreate | `Item#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link Item._preCreateOperation | `Item._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Item.Database.Create> {}

      /** Operation for {@link Item._onCreateOperation | `Item#_onCreateOperation`} */
      interface OnCreateOperation extends Item.Database.Create {}

      /** Options for {@link Item._preUpdate | `Item#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link Item._onUpdate | `Item#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link Item._preUpdateOperation | `Item._preUpdateOperation`} */
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

      /** Context for {@link Item._onDeleteOperation | `Item._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<Item.Parent> {}

      /** Context for {@link Item._onCreateDocuments | `Item._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<Item.Parent> {}

      /** Context for {@link Item._onUpdateDocuments | `Item._onUpdateDocuments`} */
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
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link Item.Database | `Item.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Item> {}

    /**
     * @deprecated {@link Item.Types | `Item.SubType`}
     */
    type TypeNames = Item.SubType;

    /**
     * @deprecated {@link Item.CreateData | `Item.CreateData`}
     */
    interface ConstructorData extends Item.CreateData {}

    /**
     * @deprecated {@link Item.implementation | `Item.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Item.Implementation | `Item.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Item document which extends the common BaseItem abstraction.
   * Each Item document contains ItemData which defines its data schema.
   *
   * @see {@link Items | `Items`}            The world-level collection of Item documents
   * @see {@link ItemSheet | `ItemSheet`}     The Item configuration application
   *
   * @param data    - Initial data provided to construct the Item document
   * @param context - The document context, see {@link foundry.abstract.Document | `foundry.abstract.Document`}
   */
  class Item<out SubType extends Item.SubType = Item.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseItem,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Item`
     * @param context - Construction context options
     */
    constructor(...args: Item.ConstructorArgs);

    /**
     * A convenience alias of Item#parent which is more semantically intuitive
     */
    get actor(): this["parent"];

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * A convenience alias of Item#isEmbedded which is preserves legacy support
     */
    get isOwned(): this["isEmbedded"];

    /**
     * Return an array of the Active Effect instances which originated from this Item.
     * The returned instances are the ActiveEffect instances which exist on the Item itself.
     */
    get transferredEffects(): ReturnType<this["effects"]["filter"]>;

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Item
     * @remarks defaults to this.system, but provided as object for flexible overrides
     */
    getRollData(): AnyObject;

    /**
     * @privateRemarks _preCreate, _onCreateDocuments and _onDeleteDocuments are all overridden but with no signature changes from BaseItem.
     */

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

    protected override _preCreateDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      data: ActiveEffect.CreateData[],
      options: ActiveEffect.Database.OnCreateOperation,
      userId: string,
    ): void;

    protected override _onCreateDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      documents: ActiveEffect.Stored[],
      result: ActiveEffect.CreateData[],
      options: ActiveEffect.Database.OnCreateOperation,
      userId: string,
    ): void;

    protected override _preUpdateDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      changes: ActiveEffect.UpdateData[],
      options: ActiveEffect.Database.OnUpdateOperation,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      documents: ActiveEffect.Stored[],
      changes: ActiveEffect.UpdateData[],
      options: ActiveEffect.Database.OnUpdateOperation,
      userId: string,
    ): void;

    protected _preDeleteDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      ids: string[],
      options: ActiveEffect.Database.OnDeleteOperation,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: Item.Stored,
      collection: ActiveEffect.ParentCollectionName,
      documents: ActiveEffect.Stored[],
      ids: string[],
      options: ActiveEffect.Database.OnDeleteOperation,
      userId: string,
    ): void;

    static override defaultName(context?: Document.DefaultNameContext<Item.SubType, Item.Parent>): string;

    static override createDialog(
      data?: Document.CreateDialogData<Item.CreateData>,
      context?: Document.CreateDialogContext<Item.SubType, Item.Parent>,
    ): Promise<Item.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Item.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Item.Implementation | undefined>;

    static override fromImport(
      source: Item.Source,
      context?: Document.FromImportContext<Item.Parent>,
    ): Promise<Item.Implementation>;
  }
}
