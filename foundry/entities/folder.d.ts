declare class Folder extends Entity<Folder.Data> {
  /** @override */
  static get config(): Entity.Config<Folder>;

  /**
   * Return whether the folder is displayed in the sidebar to the current user
   */
  get displayed(): boolean;

  /**
   * Return whether the folder is currently expanded within the sidebar interface
   */
  get expanded(): boolean;

  /**
   * A reference to the parent Folder if one is set, otherwise null
   */
  get parent(): Folder;

  /**
   * Return the named Entity type for elements in this folder.
   * @returns
   */
  get type(): string;

  /**
   * A reference to the EntityCollection of Entities for this folder type.
   * @returns
   */
  get collection(): EntityCollection;

  /**
   * Return an Array of the Entities which are contained within this Folder
   */
  get entities(): Entity[];

  /**
   * Create a new Folder by rendering a dialog window to provide basic creation details
   * @param data    - Initial data with which to populate the creation form
   * @param options - Initial positioning and sizing options for the dialog form
   * @returns An active FolderConfig instance for creating the new Folder entity
   *
   * @remarks
   * This actually returns a {@link FolderConfig} but this is incompatible with the return type in `Entity`, which is
   * `Promise<Entity>`.
   */
  static createDialog(data?: any, options?: any): any;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Export all Entities contained in this Folder to a given Compendium pack.
   * Optionally update existing Entities within the Pack by name, otherwise append all new entries.
   * @param pack         - A Compendium pack to which the entities will be exported
   * @param updateByName - Update existing entries in the Compendium pack, matching by name
   * @returns The updated Compendium Pack
   */
  exportToCompendium(
    pack: Compendium,
    {
      updateByName
    }?: {
      updateByName?: boolean;
    }
  ): Promise<Compendium>;

  /**
   * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
   * @param pack    - A pack ID to set as the default choice in the select input
   * @param options - Additional options passed to the Dialog.prompt method
   * @returns A Promise which resolves or rejects once the dialog has been submitted or closed
   */
  exportDialog(pack: string, options?: any): Promise<void>;

  /* -------------------------------------------- */
  /*  Socket Workflows                            */
  /* -------------------------------------------- */

  /** @override */
  protected static _handleDelete({ request, result, userId }: { request: any; result: any; userId: any }): any; // Folder, mismatched
}

declare namespace Folder {
  interface Data extends Entity.Data {
    color: string;
    name: string;
    parent: null | Folder;
    sort: number;
    sorting: string;
    type: string;
  }
}
