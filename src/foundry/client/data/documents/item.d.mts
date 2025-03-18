import type { ConfiguredItem } from "../../../../configuration/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace Item {
    /**
     * The implementation of the Item document instance configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredItem | `fvtt-types/configuration/ConfiguredItem`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<"Item">;

    /**
     * The implementation of the Item document configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Item">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Item"> {}

    type SubType = Game.Model.TypeNames<"Item">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Item">;
    type Known = Item.OfType<Item.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredItem<Type>, Item<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.Implementation | null;

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
      flags: fields.ObjectField.FlagsField<"Item">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Items */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Item.Parent> {}
      /** Options passed along in Create operations for Items */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Item.CreateData, Item.Parent, Temporary> {}
      /** Options passed along in Delete operations for Items */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Item.Parent> {}
      /** Options passed along in Update operations for Items */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Item.UpdateData, Item.Parent> {}

      /** Options for {@link Item.createDocuments | `Item.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Item._preCreateOperation | `Item._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Item._preCreate | `Item#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link Item._onCreate | `Item#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link Item.updateDocuments | `Item.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link Item._preUpdateOperation | `Item._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Item._preUpdate | `Item#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link Item._onUpdate | `Item#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link Item.deleteDocuments | `Item.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link Item._preDeleteOperation | `Item._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Item._preDelete | `Item#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Item._onDelete | `Item#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    /**
     * @deprecated {@link Item.DatabaseOperation | `Item.DatabaseOperation`}
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
     *
     * @deprecated Constructing `Item` directly is not advised. While `new Item(...)` would create a
     * temporary document it would not respect a system's subclass of `Item`, if any.
     *
     * You should use {@link Item.implementation | `new Item.implementation(...)`} instead which
     * will give you a system specific implementation of `Item`.
     */
    constructor(...args: Document.ConstructorParameters<Item.CreateData, Item.Parent>);

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
    getRollData(): Record<string, unknown>;

    /**
     * @privateRemarks _preCreate, _onCreateDocuments and _onDeleteDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

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
