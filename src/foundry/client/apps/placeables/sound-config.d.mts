import type { MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single AmbientSound document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class AmbientSoundConfig<
    Options extends DocumentSheetOptions<AmbientSoundDocument> = DocumentSheetOptions<AmbientSoundDocument>,
  > extends DocumentSheet<Options, AmbientSoundDocument.ConfiguredInstance> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: "SOUND.ConfigTitle",
     *   template: "templates/scene/sound-config.html",
     *   width: 480
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions<AmbientSoundDocument>;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

    protected override _updateObject(event: Event, formData: AmbientSoundConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace AmbientSoundConfig {
    type Any = AmbientSoundConfig<any>;

    type FormData = Pick<
      foundry.documents.BaseAmbientSound,
      "easing" | "path" | "volume" | "x" | "y" | "radius" | "walls"
    > & {
      "darkness.min": AmbientSoundDocument["darkness"]["min"];
      "darkness.max": AmbientSoundDocument["darkness"]["max"];
    };
  }
}
