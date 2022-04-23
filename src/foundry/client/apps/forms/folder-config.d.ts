import type { ConfiguredDocumentClass } from '../../../../types/helperTypes';
import type { SortingModes } from '../../../common/data/data.mjs/folderData';

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
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Folder>>> {
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
      resolve?: (doc: InstanceType<ConfiguredDocumentClass<typeof Folder>>) => void;
    }

    interface Data {
      name: string;
      newName: string;
      folder: foundry.data.FolderData;
      safeColor: string;
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
      sorting: SortingModes;
      type: foundry.CONST.FOLDER_DOCUMENT_TYPES;
    }
  }
}
