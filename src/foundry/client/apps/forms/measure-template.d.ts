import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class MeasuredTemplateConfig<
    Options extends DocumentSheetOptions<MeasuredTemplateDocument> = DocumentSheetOptions<MeasuredTemplateDocument>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"MeasuredTemplate">>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "template-config",
     *   classes: ["sheet", "template-sheet"],
     *   title: "TEMPLATE.MeasuredConfig",
     *   template: "templates/scene/template-config.html",
     *   width: 400,
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<MeasuredTemplateDocument>;

    override getData(): MaybePromise<object>;

    protected override _updateObject(event: Event, formData: MeasuredTemplateConfig.FormData): Promise<unknown>;
  }

  namespace MeasuredTemplateConfig {
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
