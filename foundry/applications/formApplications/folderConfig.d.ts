/**
 * Edit a folder, configuring its name and appearance
 */
declare class FolderConfig extends FormApplication<FolderConfig.Data, Folder> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "folder-edit"],
   *   template: "templates/sidebar/folder-edit.html",
   *   width: 360
   * });
   * ```
   */
  static get defaultOptions(): FormApplication.Options;

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
  protected _updateObject(event: Event, formData: FolderConfig.FormData): ReturnType<Folder['update']>;
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

  interface FormData {
    color: string;
    name: string;
    parent: string;
    sorting: 'a' | 'm';
    type: string;
  }
}
