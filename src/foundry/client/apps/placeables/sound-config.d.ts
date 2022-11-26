import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { AmbientSoundDataConstructorData } from "../../../common/data/data.mjs/ambientSoundData";

declare global {
  /**
   * The Application responsible for configuring a single AmbientSound document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class AmbientSoundConfig<
    Options extends DocumentSheetOptions<AmbientSoundDocument> = DocumentSheetOptions<AmbientSoundDocument>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"AmbientSound">>> {
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

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _updateObject(event: Event, formData: AmbientSoundConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace AmbientSoundConfig {
    type FormData = Pick<foundry.data.AmbientSoundData, "easing" | "path" | "volume"> &
      Pick<AmbientSoundDataConstructorData, "radius" | "x" | "y">;
  }
}
