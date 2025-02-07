import type { DeepPartial, InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseFolder from "../../../common/documents/folder.d.mts";

declare global {
  namespace Folder {
    type Metadata = Document.MetadataFor<Folder>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Folder">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Folder">;
    type Stored = Document.Stored<ConfiguredInstance>;

    interface DatabaseOperations extends Document.Database.Operations<Folder> {}

    // Helpful aliases
    type TypeNames = BaseFolder.TypeNames;
    type ConstructorData = BaseFolder.ConstructorData;
    type UpdateData = BaseFolder.UpdateData;
    type Schema = BaseFolder.Schema;
    type Source = BaseFolder.Source;

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
   * @see {@link Folders}            The world-level collection of Folder documents
   * @see {@link FolderConfig}       The Folder configuration application
   */
  class Folder<Type extends BaseFolder.TypeNames = BaseFolder.TypeNames> extends ClientDocumentMixin(
    foundry.documents.BaseFolder,
  )<Type> {
    static override metadata: Folder.Metadata;

    static get implementation(): Folder.ConfiguredClass;

    // TODO(LukeAbby): This random override is a symptom of a greater issue.
    // Namely that `ClientDocumentMixin` incidentally erases some properties and breaks configuration.
    documentName: "Folder";

    /**
     * The depth of this folder in its sidebar tree
     *
     * @remarks For folders that have been populated by the {@link SidebarDirectory}, this is always be defined
     */
    depth?: number;

    /**
     * An array of other Folders which are the displayed children of this one. This differs from the results of
     * {@link Folder.getSubfolders} because reports the subset of child folders which  are displayed to the current User
     * in the UI.
     */
    children: Folder.ConfiguredInstance[];

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
    get contents(): Document.ConfiguredInstanceForName<Extract<Type, Document.Type>>[];

    set contents(value);

    /**
     * The reference to the Document type which is contained within this Folder.
     */
    // TODO: Compendium Pack index
    get documentClass(): Document.ConfiguredClassForName<Extract<Type, Document.Type>>;

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
    get ancestors(): Folder.ConfiguredInstance[];

    /**
     * @privateRemarks _preCreate overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    static createDialog<T extends Document.AnyConstructor>(
      this: T,
      data?: DeepPartial<Document.ConstructorDataFor<NoInfer<T>>>,
      context?: InexactPartial<Omit<FolderConfig.Options, "resolve">>,
    ): Promise<Document.ToConfiguredInstance<T> | null | undefined>;

    /**
     * Export all Documents contained in this Folder to a given Compendium pack.
     * Optionally update existing Documents within the Pack by name, otherwise append all new entries.
     * @param pack    - A Compendium pack to which the documents will be exported
     * @param options - Additional options which customize how content is exported. See {@link ClientDocument#toCompendium}
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
    getSubfolders(recursive?: boolean): Folder.ConfiguredInstance[];

    /**
     * Get the Folder documents which are parent folders of the current folder or any if its parents.
     * @returns An array of Folder documents which are parent folders of this one
     */
    getParentFolders(): Folder.ConfiguredInstance[];
  }
}
