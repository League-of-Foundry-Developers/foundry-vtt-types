import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import type { AmbientSoundDataConstructorData } from '../../../common/data/data.mjs/ambientSoundData';

declare global {
  /**
   * The Application responsible for configuring a single AmbientSound document within a parent Scene.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class AmbientSoundConfig<
    Options extends DocumentSheetOptions = AmbientSoundConfig.Options,
    Data extends object = AmbientSoundConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'AmbientSound'>>> {
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
    static get defaultOptions(): DocumentSheetOptions;

    override get title(): string;

    override getData(options?: Partial<Options>): Promise<Data> | Data;

    protected override _updateObject(event: Event, formData: AmbientSoundConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace AmbientSoundConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'AmbientSound'>>, Options> {
      submitText: string;
      gridUnits: string;
    }

    type FormData = Pick<foundry.data.AmbientSoundData, 'easing' | 'path' | 'volume'> &
      Pick<AmbientSoundDataConstructorData, 'radius' | 'x' | 'y'>;

    type Options = DocumentSheetOptions;
  }
}
