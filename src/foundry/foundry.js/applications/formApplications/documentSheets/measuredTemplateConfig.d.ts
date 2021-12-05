import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
   * @see {@link MeasuredTemplate}
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class MeasuredTemplateConfig<
    Options extends DocumentSheet.Options = DocumentSheet.Options,
    Data extends object = MeasuredTemplateConfig.Data
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'MeasuredTemplate'>>> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "template-config",
     *   classes: ["sheet", "template-sheet"],
     *   title: "Measurement Template Configuration",
     *   template: "templates/scene/template-config.html",
     *   width: 400,
     * })
     * ```
     */
    static get defaultOptions(): DocumentSheet.Options;

    /** @override */
    getData(): Data | Promise<Data>;

    /** @override */
    protected _updateObject(
      event: Event,
      formData: MeasuredTemplateConfig.FormData
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'MeasuredTemplate'>> | undefined>;
  }

  namespace MeasuredTemplateConfig {
    interface Data<Options extends DocumentSheet.Options = DocumentSheet.Options>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'MeasuredTemplate'>>, Options> {
      templateTypes: typeof CONFIG.MeasuredTemplate.types;
      gridUnits: string;
      submitText: string;
    }

    type FormData = {
      angle: number | null;
      borderColor: string;
      direction: number | null;
      distance: number | null;
      fillColor: string;
      t: ValueOf<foundry.CONST.MEASURED_TEMPLATE_TYPES>;
      texture: string;
      width: number | null;
      x: number | null;
      y: number | null;
    };
  }
}
