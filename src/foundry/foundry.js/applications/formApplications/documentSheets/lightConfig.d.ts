import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';
import type { AmbientLightDataConstructorData } from '../../../../common/data/data.mjs/ambientLightData';
import type { AnimationDataConstructorData } from '../../../../common/data/data.mjs/animationData';

declare global {
  /**
   * The Application responsible for configuring a single AmbientLight document within a parent Scene.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class LightConfig<
    Options extends DocumentSheet.Options = DocumentSheet.Options,
    Data extends object = LightConfig.Data
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: "LIGHT.ConfigTitle",
     *   template: "templates/scene/light-config.html",
     *   width: 480
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheet.Options;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /** @override */
    close(options?: Application.CloseOptions): Promise<void>;

    /**
     * Preview the change caused by a change on the form by refreshing the display of the light source
     */
    protected _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    /** @override */
    protected _getSubmitData(
      updateData?: LightConfig.FormData
    ): ReturnType<DocumentSheet['_getSubmitData']> & { tintAlpha: number };

    /**
     * @param event - (unused)
     * @override
     */
    protected _updateObject(
      event: Event,
      formData: LightConfig.FormData
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>> | undefined>;

    /**
     * Refresh the display of the AmbientLight object
     * @internal
     */
    protected _refresh(): void;
  }

  namespace LightConfig {
    interface Data extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>> {
      submitText: string;
      lightTypes: Record<foundry.CONST.SourceType, string>;
      lightAnimations: Record<string, string> & {
        '': 'None';
      };
      colorIntensity: number;
    }

    interface FormData
      extends Pick<
        AmbientLightDataConstructorData,
        'angle' | 'bright' | 'darknessThreshold' | 'dim' | 'rotation' | 't' | 'tintAlpha' | 'tintColor' | 'x' | 'y'
      > {
      'lightAnimation.intensity': AnimationDataConstructorData['intensity'];
      'lightAnimation.speed': AnimationDataConstructorData['speed'];
      'lightAnimation.type': AnimationDataConstructorData['type'];
    }
  }
}
