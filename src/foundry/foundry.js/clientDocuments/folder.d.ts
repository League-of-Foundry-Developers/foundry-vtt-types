import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentModificationOptions } from '../../common/abstract/document.mjs';
import type { FolderDataConstructorData } from '../../common/data/data.mjs/folderData.js';

declare global {
  /**
   * The client-side Folder document which extends the common BaseFolder model.
   * Each Folder document contains FolderData which defines its data schema.
   *
   * @see {@link data.FolderData}              The Folder data schema
   * @see {@link documents.Folders}            The world-level collection of Folder documents
   * @see {@link embedded.FolderSound}         The FolderSound embedded document within a parent Folder
   * @see {@link applications.FolderConfig}    The Folder configuration application
   *
   * @param data - Initial data provided to construct the Folder document
   */
  class Folder extends ClientDocumentMixin(foundry.documents.BaseFolder) {
    /**
     * The depth of this folder in its sidebar tree
     *
     * @remarks For folders that have been populated by the {@link SidebarDirectory}, this is always be defined
     */
    depth?: number;

    /**
     * Return an array of the Document instances which are contained within this Folder.
     */
    get contents(): InstanceType<typeof CONFIG[this['data']['type']]['documentClass']>[];

    /**
     * Return whether the folder is displayed in the sidebar to the current user
     */
    get displayed(): boolean;

    /**
     * Return a reference to the Document type which is contained within this Folder.
     */
    get documentClass(): typeof CONFIG[this['data']['type']]['documentClass'];

    /**
     * Return a reference to the WorldCollection instance which provides Documents to this Folder.
     */
    get documentCollection(): Collection<InstanceType<typeof CONFIG[this['data']['type']]['documentClass']>>; // TODO: WorldCollection or ReturnType<Game['collections]['get]>

    /**
     * Return whether the folder is currently expanded within the sidebar interface.
     */
    get expanded(): boolean;

    /**
     * A reference to the parent Folder if one is set, otherwise null.
     */
    get parentFolder(): Folder | null;

    /**
     * Return the named Entity type for elements in this folder.
     */
    get type(): this['data']['type'];

    /**
     * Create a new Folder by rendering a dialog window to provide basic creation details
     * @param data    - Initial data with which to populate the creation form
     * @param options - Initial positioning and sizing options for the dialog form
     *                  (default: `{}`)
     * @returns An active FolderConfig instance for creating the new Folder entity
     *
     * @remarks
     * This actually returns a FolderConfig but that is incorrectly overriding
     * ClientDocumentMixin.createDialog, for which a Promise of the created
     * Document is returned.
     */
    static createDialog(
      data?: DeepPartial<FolderDataConstructorData | (FolderDataConstructorData & Record<string, unknown>)>,
      options?: Dialog.Options
    ): any;

    /**
     * Export all Documents contained in this Folder to a given Compendium pack.
     * Optionally update existing Documents within the Pack by name, otherwise append all new entries.
     * @param  pack         - A Compendium pack to which the entities will be exported
     * @param  updateByName - Update existing entries in the Compendium pack, matching by name
     *                        (default: `false`)
     * @returns The updated Compendium Collection instance
     */
    exportToCompendium(pack: any, { updateByName }?: { updateByName?: boolean }): Promise<any>; // TODO: CompendiumCollection

    /**
     * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
     * @param pack    - A pack ID to set as the default choice in the select input
     * @param options - Additional options passed to the Dialog.prompt method
     *                  (default: `{}`)
     * @returns A Promise which resolves or rejects once the dialog has been submitted or closed
     */
    exportDialog(pack: string, options?: Dialog.Options): Promise<void>;

    /**
     * Get the Folder documents which are sub-folders of the current folder, either direct children or recursively.
     * @param recursive - Identify child folders recursively, if false only direct children are returned
     *                    (default: `false`)
     * @returns An array of Folder documents which are subfolders of this one
     */
    getSubfolders(recursive?: boolean): InstanceType<ConfiguredDocumentClass<typeof Folder>>[];

    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * @deprecated since 0.8.0
     */
    get entities(): this['contents'];
  }
}
