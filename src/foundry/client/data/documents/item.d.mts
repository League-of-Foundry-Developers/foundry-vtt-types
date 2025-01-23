import type { ConfiguredItem } from "../../../../configuration/index.d.mts";
import type { HandleEmptyObject } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseGetOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

declare global {
  namespace Item {
    /**
     * The implementation of the Item document instance configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredItem | `configuration/ConfiguredItem`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Item">;

    /**
     * The implementation of the Item document configured through `CONFIG.Item.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Item">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Item"> {}

    type SubType = Game.Model.TypeNames<"Item">;
    type OfType<Type extends SubType> = HandleEmptyObject<ConfiguredItem<Type>, Item<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.ConfiguredInstance | null;

    /**
     * An instance of `Item` that comes from the database.
     */
    interface Stored extends Document.Stored<Item.ConfiguredInstance> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Item._source | `Item._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
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
     * The data after a {@link Document | `Document`} has been initialized, for example
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
       * @defaultValue see {@link fields.DocumentOwnershipField}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Item">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      interface Get extends DatabaseGetOperation<Item.Parent> {}
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends DatabaseCreateOperation<Item.CreateData, Item.Parent, Temporary> {}
      interface Delete extends DatabaseDeleteOperation<Item.Parent> {}
      interface Update extends DatabaseUpdateOperation<Item.UpdateData, Item.Parent> {}

      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link Item.DatabaseOperation}
     */
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
   * @see {@link Items}            The world-level collection of Item documents
   * @see {@link ItemSheet}     The Item configuration application
   *
   * @param data    - Initial data provided to construct the Item document
   * @param context - The document context, see {@link foundry.abstract.Document}
   */
  class Item<out SubType extends Item.SubType = Item.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseItem,
  )<SubType> {
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

    /**
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overrideable.
     */

    static override metadata: Item.Metadata;

    static get implementation(): Item.ImplementationClass;

    static override defaultName(context?: Document.DefaultNameContext<Item.SubType, Item.Parent>): string;

    static override createDialog(
      data: Item.CreateData,
      context?: Document.CreateDialogContext<Item.SubType, Item.Parent>,
    ): Promise<Item.Implementation | null | undefined>;

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
