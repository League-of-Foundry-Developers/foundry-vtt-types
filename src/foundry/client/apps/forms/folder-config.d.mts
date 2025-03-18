import type { GetDataReturnType, MaybePromise, ValueOf } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Folder document.
   *
   * @typeParam Options - the type of the options object
   */
  class FolderConfig<Options extends FolderConfig.Options = FolderConfig.Options> extends DocumentSheet<
    Options,
    Folder.Implementation
  > {
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
    static override get defaultOptions(): FolderConfig.Options;

    override get id(): string;

    override get title(): string;

    override close(options?: Application.CloseOptions): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<FolderConfig.FolderConfigData>>;

    protected override _updateObject(event: Event, formData: FolderConfig.FormData): Promise<unknown>;
  }

  namespace FolderConfig {
    interface Any extends FolderConfig<any> {}

    interface Options extends DocumentSheet.Options<Folder.Implementation> {
      resolve?: (doc: Folder.Implementation) => void;
    }

    interface FormData {
      color: string;
      name: string;
      parent: string;
      sorting: ValueOf<typeof Folder.SORTING_MODES>;
      type: foundry.CONST.FOLDER_DOCUMENT_TYPES;
    }

    interface FolderConfigData {
      folder: ReturnType<FolderConfig["object"]["toObject"]>;
      name: string;
      newName: string;
      safeColor: string;
      sortingModes: { a: string; m: string };
      submitText: string;
    }
  }
}
