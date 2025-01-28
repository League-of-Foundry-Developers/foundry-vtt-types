import type { GetDataReturnType, MaybePromise } from "../../../../utils/index.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single PlaylistSound document within a parent Playlist.
   *
   * @param sound   - The PlaylistSound document being configured
   * @param options - Additional application rendering options
   * @typeParam Options - the type of the options object
   */
  class PlaylistSoundConfig<
    Options extends
      DocumentSheetOptions<PlaylistSound.Implementation> = DocumentSheetOptions<PlaylistSound.Implementation>,
  > extends DocumentSheet<Options, PlaylistSound.Implementation> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "track-config",
     *   template: "templates/playlist/edit-track.html",
     *   width: 360
     * });
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<PlaylistSound.Implementation>;

    override get title(): string;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<PlaylistSoundConfig.PlaylistSoundConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Auto-populate the track name using the provided filename, if a name is not already set
     * @internal
     */
    protected _onSourceChange(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData: PlaylistSoundConfig.FormData): Promise<unknown>;
  }

  namespace PlaylistSoundConfig {
    type Any = PlaylistSoundConfig<any>;

    interface FormData {
      description: string;
      fade: number | null;
      lvolume: number;
      name: string;
      path: string;
      repeat: boolean;
    }

    interface PlaylistSoundConfigData<
      Options extends
        DocumentSheetOptions<PlaylistSound.Implementation> = DocumentSheetOptions<PlaylistSound.Implementation>,
    > extends DocumentSheet.DocumentSheetData<Options, PlaylistSound.Implementation> {
      lvolume: number;
    }
  }
}
