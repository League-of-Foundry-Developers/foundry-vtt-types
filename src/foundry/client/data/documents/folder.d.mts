import type { ConfiguredFolder } from "../../../../configuration/index.d.mts";
import type { InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseFolder from "../../../common/documents/folder.d.mts";

declare global {
  namespace Folder {
    /**
     * The implementation of the Folder document instance configured through `CONFIG.Folder.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredFolder | `fvtt-types/configuration/ConfiguredFolder`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Folder">;

    /**
     * The implementation of the Folder document configured through `CONFIG.Folder.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Folder">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Folder"> {}

    type SubType = Game.Model.TypeNames<"Folder">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Folder">;
    type Known = Folder.OfType<Folder.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredFolder<Type>, Folder<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.Implementation | Item.Implementation | null;

    /**
     * An instance of `Folder` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Folder._source | `Folder._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Folder.create | `Folder.create`}
     * and {@link Folder | `new Folder(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Folder.name | `Folder#name`}.
     *
     * This is data transformed from {@link Folder.Source | `Folder.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Folder.update | `Folder#update`}.
     * It is a distinct type from {@link Folder.CreateData | `DeepPartial<Folder.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Folder | `Folder`}. This is the source of truth for how an Folder document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Folder | `Folder`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Folder document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /** The name of this Folder */
      name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

      /** The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES */
      type: fields.DocumentTypeField<typeof BaseFolder>;

      /**
       * An HTML description of the contents of this folder
       * @defaultValue `""`
       */
      description: fields.HTMLField<{ textSearch: true }>;

      /**
       * The _id of a parent Folder which contains this Folder
       * @defaultValue `null`
       */
      folder: fields.ForeignDocumentField<typeof BaseFolder>;

      /**
       * The sorting mode used to organize documents within this Folder, in ["a", "m"]
       * @defaultValue `"a"`
       */
      sorting: fields.StringField<{ required: true; initial: "a"; choices: typeof BaseFolder.SORTING_MODES }>;

      /**
       * The numeric sort value which orders this Folder relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * A color string used for the background color of this Folder
       * @defaultValue `null`
       */
      color: fields.ColorField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Folder">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }
    namespace DatabaseOperation {
      /** Options passed along in Get operations for Folders */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Folder.Parent> {}
      /** Options passed along in Create operations for Folders */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Folder.CreateData, Folder.Parent, Temporary> {}
      /** Options passed along in Delete operations for Folders */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Folder.Parent> {}
      /** Options passed along in Update operations for Folders */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Folder.UpdateData, Folder.Parent> {}

      /** Options for {@link Folder.createDocuments | `Folder.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Folder._preCreateOperation | `Folder._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Folder._preCreate | `Folder#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Folder._onCreate | `Folder#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Folder.updateDocuments | `Folder.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Folder._preUpdateOperation | `Folder._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Folder._preUpdate | `Folder#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Folder._onUpdate | `Folder#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Folder.deleteDocuments | `Folder.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Folder._preDeleteOperation | `Folder._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Folder._preDelete | `Folder#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Folder._onDelete | `Folder#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated {@link Folder.DatabaseOperation | `Folder.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Folder> {}

    /**
     * @deprecated {@link Folder.Types | `Folder.SubType`}
     */
    type TypeNames = Folder.SubType;

    /**
     * @deprecated {@link Folder.CreateData | `Folder.CreateData`}
     */
    interface ConstructorData extends Folder.CreateData {}

    /**
     * @deprecated {@link Folder.implementation | `Folder.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Folder.Implementation | `Folder.Implementation`}
     */
    type ConfiguredInstance = Implementation;

    /**
     * Actual document types that go in folders
     */
    type DocumentType = Exclude<foundry.CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;

    interface ExportToCompendiumOptions {
      /** Update existing entries in the Compendium pack, matching by name */
      updateByName?: boolean | undefined;
    }
  }

  /**
   * The client-side Folder document which extends the common BaseFolder model.
   *
   * @see {@link Folders | `Folders`}            The world-level collection of Folder documents
   * @see {@link FolderConfig | `FolderConfig`}       The Folder configuration application
   */
  class Folder<out SubType extends Folder.SubType = Folder.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseFolder,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Folder`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Folder` directly is not advised. While `new Folder(...)` would create a
     * temporary document it would not respect a system's subclass of `Folder`, if any.
     *
     * You should use {@link Folder.implementation | `new Folder.implementation(...)`} instead which
     * will give you a system specific implementation of `Folder`.
     */
    constructor(...args: Document.ConstructorParameters<Folder.CreateData, Folder.Parent>);

    /**
     * The depth of this folder in its sidebar tree
     *
     * @remarks For folders that have been populated by the {@link SidebarDirectory | `SidebarDirectory`}, this is always be defined
     */
    depth?: number;

    /**
     * An array of other Folders which are the displayed children of this one. This differs from the results of
     * {@link Folder.getSubfolders | `Folder.getSubfolders`} because reports the subset of child folders which  are displayed to the current User
     * in the UI.
     */
    children: Folder.Implementation[];

    /**
     * Return whether the folder is displayed in the sidebar to the current User.
     */
    displayed: boolean;

    /**
     * The array of the Document instances which are contained within this Folder,
     * unless it's a Folder inside a Compendium pack, in which case it's the array
     * of objects inside the index of the pack that are contained in this Folder.
     */
    // TODO: Handle compendium. This requires the index to be configured.
    get contents(): Document.ImplementationInstanceFor<Extract<SubType, Document.Type>>[];

    set contents(value);

    /**
     * The reference to the Document type which is contained within this Folder.
     */
    // TODO: Compendium Pack index
    get documentClass(): Document.ImplementationClassFor<Extract<SubType, Document.Type>>;

    /**
     * The reference to the WorldCollection instance which provides Documents to this Folder,
     * unless it's a Folder inside a Compendium pack, in which case it's the index of the pack.
     * A world Folder containing CompendiumCollections will have neither.
     */
    // TODO: Compendium Pack index
    get documentCollection(): this["pack"] extends string ? unknown : undefined;

    /**
     * Return whether the folder is currently expanded within the sidebar interface.
     */
    get expanded(): boolean;

    /**
     * Return the list of ancestors of this folder, starting with the parent.
     */
    get ancestors(): Folder.Implementation[];

    /**
     * @privateRemarks _preCreate overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    static override createDialog(
      data?: Document.CreateDialogData<Folder.CreateData>,
      context?: InexactPartial<Omit<FolderConfig.Options, "resolve">>,
    ): Promise<Folder.Stored | null | undefined>;

    /**
     * Export all Documents contained in this Folder to a given Compendium pack.
     * Optionally update existing Documents within the Pack by name, otherwise append all new entries.
     * @param pack    - A Compendium pack to which the documents will be exported
     * @param options - Additional options which customize how content is exported. See {@link ClientDocument.toCompendium | `ClientDocument#toCompendium`}
     *                  (default: `{}`)
     * @returns The updated Compendium Collection instance
     */
    exportToCompendium<Metadata extends CompendiumCollection.Metadata>(
      pack: CompendiumCollection<Metadata>,
      options?: Folder.ExportToCompendiumOptions,
    ): Promise<CompendiumCollection<Metadata>>;

    /**
     * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
     * @param pack    - A pack ID to set as the default choice in the select input
     * @param options - Additional options passed to the Dialog.prompt method
     *                  (default: `{}`)
     * @returns A Promise which resolves or rejects once the dialog has been submitted or closed
     *
     * @remarks - Foundry documents `pack` as just being a `string` but it is unused and Foundry itself
     * calls `exportDialog` with `null`.
     */
    exportDialog(pack: string | null, options?: Dialog.Options): Promise<void>;

    /**
     * Get the Folder documents which are sub-folders of the current folder, either direct children or recursively.
     * @param recursive - Identify child folders recursively, if false only direct children are returned
     *                    (default: `false`)
     * @returns An array of Folder documents which are subfolders of this one
     */
    getSubfolders(recursive?: boolean): Folder.Implementation[];

    /**
     * Get the Folder documents which are parent folders of the current folder or any if its parents.
     * @returns An array of Folder documents which are parent folders of this one
     */
    getParentFolders(): Folder.Implementation[];

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<Folder.SubType, Folder.Parent>): string;

    static override fromDropData(
      data: Document.DropData<Folder.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Folder.Implementation | undefined>;

    static override fromImport(
      source: Folder.Source,
      context?: Document.FromImportContext<Folder.Parent>,
    ): Promise<Folder.Implementation>;
  }
}
