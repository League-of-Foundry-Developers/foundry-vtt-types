import type { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single PlaylistSound document within a parent Playlist.
   *
   * @param sound   - The PlaylistSound document being configured
   * @param options - Additional application rendering options
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class PlaylistSoundConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = PlaylistSoundConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>> {
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
    static override get defaultOptions(): DocumentSheetOptions;

    override get title(): string;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    override activateListeners(html: JQuery): void;

    /**
     * Auto-populate the track name using the provided filename, if a name is not already set
     * @internal
     */
    protected _onSourceChange(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData: PlaylistSoundConfig.FormData): Promise<unknown>;
  }

  namespace PlaylistSoundConfig {
    /**
     * @typeParam Options - the type of the options object
     */
    interface Data<Options extends DocumentSheetOptions = DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>, Options> {
      lvolume: number;
    }

    interface FormData {
      description: string;
      fade: number | null;
      lvolume: number;
      name: string;
      path: string;
      repeat: boolean;
    }
  }
}
