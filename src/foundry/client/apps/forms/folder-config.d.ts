import type BaseFolder from '../../../common/documents/folder.mjs';

declare global {
  /**
   * The Application responsible for configuring a single Folder document.
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class FolderConfig<
    Options extends FolderConfig.Options = FolderConfig.Options,
    Data extends object = FolderConfig.Data
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredFolder>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "folder-edit"],
     *   template: "templates/sidebar/folder-edit.html",
     *   width: 360
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    override get id(): string;

    override get title(): string;

    override close(options?: Application.CloseOptions | undefined): Promise<void>;

    override getData(options?: Partial<Options>): Promise<Data>;

    protected override _updateObject(event: Event, formData: FolderConfig.FormData): Promise<unknown>;
  }

  namespace FolderConfig {
    interface Options extends DocumentSheetOptions {
      resolve?: (doc: InstanceType<ConfiguredFolder>) => void;
    }

    interface Data {
      name: string;
      newName: string;
      folder: BaseFolder['_source'];
      safeColor: string;
      sortingModes: BaseFolder.SortingModes;
      submitText: string;
    }

    interface FormData {
      color: string;
      name: string;
      parent: string;
      sorting: ValueOf<Data['sortingModes']>;
      type: foundry.CONST.FOLDER_DOCUMENT_TYPES;
    }
  }
}
