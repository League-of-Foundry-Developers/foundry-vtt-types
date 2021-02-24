/**
 * Edit a folder, configuring its name and appearance
 */
declare class FolderConfig extends FormApplication<FolderConfig.Data, Folder> {
  /**
   * @override
   */
  static get defaultOptions(): FolderConfig.Options;

  /**
   * @override
   */
  get id(): string;

  /**
   * @override
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<FolderConfig.Data>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: Folder.Data): Promise<Folder | Folder | null>;
}

declare namespace FolderConfig {
  interface Data {
    folder: Folder.Data;
    sortingModes: {
      a: 'FOLDER.SortAlphabetical';
      m: 'FOLDER.SortManual';
    };
    submitText: string;
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `['sheet', 'folder-edit']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/sidebar/folder-edit.html'`
     */
    template: string;

    /**
     * @defaultValue `360`
     */
    width: number;
  }
}
