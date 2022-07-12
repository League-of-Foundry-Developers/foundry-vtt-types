import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import type DataModel from '../../../common/abstract/data.mjs';

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

    interface FormData
      extends Pick<
        DataModel.SchemaToSourceInput<foundry.documents.BaseAmbientLight['schema']>,
        'x' | 'y' | 'rotation' | 'walls' | 'vision'
      > {
      'config.dim': foundry.data.LightData['dim'];
      'config.bright': foundry.data.LightData['bright'];
      'config.angle': foundry.data.LightData['angle'];
      'config.color': foundry.data.LightData['color'];
      'config.alpha': foundry.data.LightData['alpha'];
      'config.darkness.min': foundry.data.LightData['darkness']['min'];
      'config.darkness.max': foundry.data.LightData['darkness']['max'];
      'config.animation.type': foundry.data.LightData['animation']['type'];
      'config.animation.speed': foundry.data.LightData['animation']['speed'];
      'config.animation.reverse': foundry.data.LightData['animation']['reverse'];
      'config.animation.intensity': foundry.data.LightData['animation']['intensity'];
      'config.coloration': foundry.data.LightData['coloration'];
      'config.luminosity': foundry.data.LightData['luminosity'];
      'config.attenuation': foundry.data.LightData['attenuation'];
      'config.saturation': foundry.data.LightData['saturation'];
      'config.contrast': foundry.data.LightData['contrast'];
      'config.shadows': foundry.data.LightData['shadows'];
    }
  }

  /**
   * @deprecated since v9
   */
  class LightConfig extends AmbientLightConfig {
    constructor(...args: ConstructorParameters<typeof AmbientLightConfig>);
  }
}
