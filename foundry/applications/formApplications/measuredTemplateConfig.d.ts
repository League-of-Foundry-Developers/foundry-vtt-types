/**
 * A configuration Form Application for modifying the properties of a MeasuredTemplate object.
 * @see {@link MeasuredTemplate}
 */
declare class MeasuredTemplateConfig extends FormApplication<
  FormApplication.Options,
  MeasuredTemplateConfig.Data,
  MeasuredTemplate
> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "template-config",
   *   classes: ["sheet", "template-sheet"],
   *   title: "Measurement Template Configuration",
   *   template: "templates/scene/template-config.html",
   *   width: 400
   * });
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * @override
   */
  getData(): MeasuredTemplateConfig.Data;

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: MeasuredTemplateConfig.FormData): Promise<MeasuredTemplate | null>;
}

declare namespace MeasuredTemplateConfig {
  interface Data {
    gridUnits: Scene['data']['gridUnits'];
    object: Duplicated<MeasuredTemplateConfig['object']['data']>;
    options: MeasuredTemplateConfig['options'];
    submitText: string;
    templateTypes: typeof CONFIG['MeasuredTemplate']['types'];
  }

  type FormData = {
    angle: MeasuredTemplate.Data['angle'];
    borderColor: MeasuredTemplate.Data['borderColor'];
    direction: MeasuredTemplate.Data['direction'] | null;
    distance: MeasuredTemplate.Data['distance'] | null;
    fillColor: MeasuredTemplate.Data['fillColor'];
    t: MeasuredTemplate.Data['t'];
    texture: MeasuredTemplate.Data['texture'];
    width: MeasuredTemplate.Data['width'];
    x: MeasuredTemplate.Data['x'] | null;
    y: MeasuredTemplate.Data['y'] | null;
  };
}
