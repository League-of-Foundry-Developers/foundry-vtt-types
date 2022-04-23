import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import type { AmbientLightDataConstructorData } from '../../../common/data/data.mjs/ambientLightData';
import type { AnimationDataConstructorData } from '../../../common/data/data.mjs/animationData';
import type { DarknessActivationConstructorData } from '../../../common/data/data.mjs/darknessActivation';
import type { LightDataConstructorData } from '../../../common/data/data.mjs/lightData';

declare global {
  /**
   * The Application responsible for configuring a single AmbientLight document within a parent Scene.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class AmbientLightConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = AmbientLightConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "ambient-light-config",
     *   classes: ["sheet", "ambient-light-config"],
     *   title: "LIGHT.ConfigTitle",
     *   template: "templates/scene/ambient-light-config.html",
     *   width: 480,
     *   height: "auto",
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "basic"}]
     * });
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    override close(options?: Application.CloseOptions): Promise<void>;

    override activateListeners(html: JQuery): void;

    /**
     * Preview the change caused by a change on the form by refreshing the display of the light source
     */
    protected _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    protected _onResetForm(event: PointerEvent): void;

    protected override _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

    protected override _updateObject(event: Event, formData: AmbientLightConfig.FormData): Promise<unknown>;

    /**
     * Refresh the display of the AmbientLight object
     * @internal
     */
    protected _refresh(): void;
  }

  namespace AmbientLightConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>, Options> {
      isAdvanced: boolean;
      colorationTechniques: typeof AdaptiveLightingShader.COLORATION_TECHNIQUES;
      lightAnimations: Record<string, string> & {
        '': 'None';
      };
      submitText: string;
    }

    interface FormData extends Pick<AmbientLightDataConstructorData, 'x' | 'y' | 'rotation' | 'walls' | 'vision'> {
      'config.dim': LightDataConstructorData['dim'];
      'config.bright': LightDataConstructorData['bright'];
      'config.angle': LightDataConstructorData['angle'];
      'config.color': LightDataConstructorData['color'];
      'config.alpha': LightDataConstructorData['alpha'];
      'config.darkness.min': DarknessActivationConstructorData['min'];
      'config.darkness.max': DarknessActivationConstructorData['max'];
      'config.animation.type': AnimationDataConstructorData['type'];
      'config.animation.speed': AnimationDataConstructorData['speed'];
      'config.animation.reverse': AnimationDataConstructorData['reverse'];
      'config.animation.intensity': AnimationDataConstructorData['intensity'];
      'config.coloration': LightDataConstructorData['coloration'];
      'config.luminosity': LightDataConstructorData['luminosity'];
      'config.gradual': LightDataConstructorData['gradual'];
      'config.saturation': LightDataConstructorData['saturation'];
      'config.contrast': LightDataConstructorData['contrast'];
      'config.shadows': LightDataConstructorData['shadows'];
    }
  }

  /**
   * @deprecated since v9
   */
  class LightConfig extends AmbientLightConfig {
    constructor(...args: ConstructorParameters<typeof AmbientLightConfig>);
  }
}
