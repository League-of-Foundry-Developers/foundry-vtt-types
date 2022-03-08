import type { ConfiguredDocumentClass } from '../../../../../types/helperTypes';
import type { SortingModes } from '../../../../common/data/data.mjs/folderData';

declare global {
  /**
   * The Application responsible for configuring a single Folder document.
   */
  class FolderConfig extends DocumentSheet<
    DocumentSheetOptions,
    FolderConfig.Data,
    InstanceType<ConfiguredDocumentClass<typeof Folder>>
  > {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "folder-edit"],
     *   template: "templates/sidebar/folder-edit.html",
     *   width: 360
     * })
     * ```
     */
    static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

    /** @override */
    get id(): string;

    /** @override */
    get title(): string;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<FormApplicationOptions>): Promise<FolderConfig.Data>;

    /**
     * @param event - (unused)
     * @override
     * @internal
     */
    protected _updateObject(
      event: Event,
      formData: FolderConfig.FormData
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Folder>> | undefined>;
  }

  namespace FolderConfig {
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
