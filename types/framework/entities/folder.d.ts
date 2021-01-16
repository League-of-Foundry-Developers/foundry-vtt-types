/**
 * The Folders EntityCollection
 * @extends {EntityCollection}
 */
declare class Folders extends EntityCollection<Folder> {
    /**
     * This tracks which folders are currently expanded in the UI
     * @private
     */
    _expanded: {
      [id: string]: boolean
    }

  /* -------------------------------------------- */

  /** @override */
  get entity(): string

  /* -------------------------------------------- */

  /** @override */
  render(force?: boolean, context?: any): any // Mismatched return type

  /* -------------------------------------------- */

  /**
   * Refresh the display of any active JournalSheet instances where the folder list will change.
   * @private
   */
  _refreshJournalEntrySheets(): void
}

declare class Folder<D extends Folder.Data = Folder.Data> extends Entity<D> {
  /** @override */
  static get config (): Entity.Config;

  /**
   * Return whether the folder is displayed in the sidebar to the current user
   * @type {boolean}
   */
  get displayed (): boolean

  /**
   * Return whether the folder is currently expanded within the sidebar interface
   * @type {boolean}
   */
  get expanded (): boolean

  /**
   * A reference to the parent Folder if one is set, otherwise null
   * @type {Folder|null}
   */
  get parent (): Folder<D>

  /**
   * Return the named Entity type for elements in this folder.
   * @return {string}
   */
  get type (): string

  /**
   * A reference to the EntityCollection of Entities for this folder type.
   * @return {EntityCollection}
   */
  get collection (): EntityCollection

  /**
   * Return an Array of the Entities which are contained within this Folder
   * @type {Entity[]}
   */
  get entities (): Entity[]

  /**
   * Create a new Folder by rendering a dialog window to provide basic creation details
   * @param {object} data       Initial data with which to populate the creation form
   * @param {object} options    Initial positioning and sizing options for the dialog form
   * @return {FolderConfig}     An active FolderConfig instance for creating the new Folder entity
   */
  static createDialog (data?: any, options?: any): any // TODO FolderConfig I think, shoud be Promise<Entity>

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Export all Entities contained in this Folder to a given Compendium pack.
   * Optionally update existing Entities within the Pack by name, otherwise append all new entries.
   * @param {Compendium} pack       A Compendium pack to which the entities will be exported
   * @param {boolean} updateByName  Update existing entries in the Compendium pack, matching by name
   * @return {Promise<Compendium>}  The updated Compendium Pack
   */
  exportToCompendium (pack: Compendium, { updateByName }?: {
    updateByName?: boolean
  }): Promise<Compendium>

  /**
   * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
   * @param {string} pack       A pack ID to set as the default choice in the select input
   * @param {object} options    Additional options passed to the Dialog.prompt method
   * @return {Promise<void>}    A Promise which resolves or rejects once the dialog has been submitted or closed
   */
  exportDialog (pack: string, options?: any): Promise<void>

  /* -------------------------------------------- */
  /*  Socket Workflows                            */
  /* -------------------------------------------- */

  /** @override */
  static _handleDelete ({ request, result, userId }: {
    request: any
    result: any
    userId: any
  }): any // Folder, mismatched
}

declare namespace Folder {
  interface Data extends Entity.Data {
    parent: Folder | null
    sort: number
    sorting: string
    type: string
  }
}
