import type { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Playlist document.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class PlaylistConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = PlaylistConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Playlist>>> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.id = "playlist-config";
     * options.template = "templates/playlist/edit-playlist.html";
     * options.width = 360;
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions;

    override get title(): string;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    protected override _getFilePickerOptions(event: PointerEvent): FilePickerOptions;

    /**
     * @remarks The return type could be given more concretely but it is not supposed to be used.
     */
    protected override _onSelectFile(selection: string, filePicker: FilePicker): unknown;
  }

  namespace PlaylistConfig {
    interface Data<Options extends DocumentSheetOptions = DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClass<typeof Playlist>>, Options> {
      modes: Record<foundry.CONST.PLAYLIST_MODES, string>;
      sorting: Record<foundry.CONST.PLAYLIST_SORT_MODES, string>;
    }
  }
}
