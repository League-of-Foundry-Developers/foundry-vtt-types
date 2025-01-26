import type { GetDataReturnType, MaybePromise, ValueOf } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Playlist document.
   * @typeParam Options - the type of the options object
   */
  class PlaylistConfig<
    Options extends
      DocumentSheetOptions<Playlist.ConfiguredInstance> = DocumentSheetOptions<Playlist.ConfiguredInstance>,
  > extends DocumentSheet<Options, Playlist.ConfiguredInstance> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.id = "playlist-config";
     * options.template = "templates/playlist/edit-playlist.html";
     * options.width = 360;
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions<Playlist.ConfiguredInstance>;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<PlaylistConfig.PlaylistConfigData>>;

    protected override _getFilePickerOptions(event: PointerEvent): FilePickerOptions;

    /**
     * @remarks The return type could be given more concretely but it is not supposed to be used.
     */
    protected override _onSelectFile(selection: string, filePicker: FilePicker): unknown;
  }

  namespace PlaylistConfig {
    type Any = PlaylistConfig<any>;

    interface PlaylistConfigData<
      Options extends
        DocumentSheetOptions<Playlist.ConfiguredInstance> = DocumentSheetOptions<Playlist.ConfiguredInstance>,
    > extends DocumentSheet.DocumentSheetData<Options, Playlist.ConfiguredInstance> {
      modes: Record<ValueOf<typeof foundry.CONST.PLAYLIST_MODES>, string>;
      sorting: Record<ValueOf<typeof foundry.CONST.PLAYLIST_SORT_MODES>, string>;
    }
  }
}
