/**
 * A configuration Form Application for modifying the properties of a MeasuredTemplate object.
 * @see {@link MeasuredTemplate}
 */
declare class MeasuredTemplateConfig extends FormApplication<MeasuredTemplateConfig.Data, MeasuredTemplate> {
  /**
   * @override
   */
  static get defaultOptions(): MeasuredTemplateConfig.Options;

  /**
   * @override
   */
  getData(): MeasuredTemplateConfig.Data;

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: MeasuredTemplate.Data): Promise<MeasuredTemplate | null>;
}

declare namespace MeasuredTemplateConfig {
  interface Data {
    object: Duplicated<MeasuredTemplateConfig['object']['data']>;
    options: Options;
    templateTypes: typeof CONFIG['MeasuredTemplate']['types'];
    gridUnits: Scene.Data;
    submitText: string;
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'template-config'`
     */
    id: string;

    /**
     * @defaultValue `['sheet', 'template-sheet']`
     */
    classes: string[];

    /**
     * @defaultValue `'Measurement Template Configuration'`
     */
    title: string;

    /**
     * @defaultValue `'templates/scene/template-config.html'`
     */
    template: string;

    /**
     * @defaultValue `400`
     */
    width: number;
  }
}
