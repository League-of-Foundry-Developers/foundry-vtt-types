/**
 * Light Source Configuration Sheet
 */
declare class LightConfig extends FormApplication<LightConfig.Data, AmbientLight> {
  /**
   * @param light   - The AmbientLight object for which settings are being configured
   * @param options - LightConfig ui options (see Application)
   */
  constructor(light: AmbientLight, options?: Partial<FormApplication.Options>);

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "light-sheet"],
   *   title: "LIGHT.ConfigTitle",
   *   template: "templates/scene/light-config.html",
   *   width: 480
   * });
   * ```
   */
  static get defaultOptions(): FormApplication.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): LightConfig.Data;

  /** @override */
  activateListeners(html: JQuery): void;

  /** @override */
  close(options?: Application.CloseOptions): Promise<void>;

  /**
   * Preview the change caused by a change on the form by refreshing the display of the light source
   */
  protected _onPreviewChange(event: JQuery.ChangeEvent): void;

  /** @override */
  protected _getSubmitData(updateData?: object): ReturnType<FormApplication['_getSubmitData']> & { tintAlpha: number };

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: LightConfig.FormData): Promise<AmbientLight>;

  /**
   * Reset the state of the previewed light source object to its original data
   * @param refresh - (default: `true`)
   */
  protected _resetObject(refresh: boolean): void;
}

declare namespace LightConfig {
  interface Data {
    object: Duplicated<LightConfig['object']['data']>;
    options: LightConfig['options'];
    submitText: string;
    lightTypes: LightTypes;
    lightAnimations: LightAnimations;
    colorIntensity: number;
  }

  interface FormData {
    angle: AmbientLight.Data['angle'] | null;
    bright: AmbientLight.Data['bright'] | null;
    darknessThreshold: AmbientLight.Data['darknessThreshold'];
    dim: AmbientLight.Data['dim'] | null;
    'lightAnimation.intensity': AmbientLight.Data['lightAnimation']['intensity'];
    'lightAnimation.speed': AmbientLight.Data['lightAnimation']['speed'];
    'lightAnimation.type': AmbientLight.Data['lightAnimation']['type'];
    rotation: AmbientLight.Data['rotation'];
    t: AmbientLight.Data['t'];
    tintAlpha: AmbientLight.Data['tintAlpha'];
    tintColor: string;
    x: AmbientLight.Data['x'] | null;
    y: AmbientLight.Data['y'] | null;
  }

  type LightAnimations = {
    [Key in keyof typeof CONFIG['Canvas']['lightAnimations']]: string;
  } & { '': 'None' };

  type LightTypes = {
    [Key in keyof typeof CONST['SOURCE_TYPES'] as typeof CONST['SOURCE_TYPES'][Key]]: `LIGHT.Type${Capitalize<
      Lowercase<Key>
    >}`;
  };
}
