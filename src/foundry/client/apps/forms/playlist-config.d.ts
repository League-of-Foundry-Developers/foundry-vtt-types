import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for configuring a single Playlist document.
   * @typeParam Options - the type of the options object
   */
  class PlaylistConfig<
    Options extends DocumentSheetOptions<Playlist> = DocumentSheetOptions<Playlist>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClass<typeof Playlist>>> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.id = "playlist-config";
     * options.template = "templates/playlist/edit-playlist.html";
     * options.width = 360;
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions<Playlist>;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _getFilePickerOptions(event: PointerEvent): FilePickerOptions;

    /**
     * @remarks The return type could be given more concretely but it is not supposed to be used.
     */
    protected override _onSelectFile(selection: string, filePicker: FilePicker): unknown;
  }
}
