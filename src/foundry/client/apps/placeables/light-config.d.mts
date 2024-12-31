import type { InterfaceToObject, AnyObject, DeepPartial, MaybePromise } from "../../../../utils/index.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single AmbientLight document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class AmbientLightConfig<
    Options extends
      DocumentSheetOptions<AmbientLightDocument.ConfiguredInstance> = DocumentSheetOptions<AmbientLightDocument.ConfiguredInstance>,
  > extends DocumentSheet<Options, AmbientLightDocument.ConfiguredInstance> {
    /**
     * Maintain a copy of the original to show a real-time preview of changes.
     */
    preview: AmbientLightDocument.ConfiguredInstance;

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
    static override get defaultOptions(): DocumentSheetOptions<AmbientLightDocument.ConfiguredInstance>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override close(options?: Application.CloseOptions): Promise<void>;

    override activateListeners(html: JQuery): void;

    /**
     * Preview the change caused by a change on the form by refreshing the display of the light source
     */
    protected _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    protected _onResetForm(event: PointerEvent): void;

    /**
     * Preview changes to the AmbientLight document as if they were true document updates.
     * @param change - A change to preview
     */
    protected _previewChanges(change: DeepPartial<AmbientLightDocument["_source"]>): void;

    /**
     * Restore the true data for the AmbientLight document when the form is submitted or closed.
     */
    protected _resetPreview(): void;

    protected override _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

    protected override _getSubmitData(updateData?: AnyObject | null): InterfaceToObject<AmbientLightConfig.FormData>;

    protected override _updateObject(event: Event, formData: AmbientLightConfig.FormData): Promise<unknown>;

    /**
     * Refresh the display of the AmbientLight object
     * @internal
     */
    protected _refresh(): void;
  }

  namespace AmbientLightConfig {
    type Any = AmbientLightConfig<any>;

    interface FormData {
      x: AmbientLightDocument["x"];
      y: AmbientLightDocument["y"];
      rotation: AmbientLightDocument["rotation"];
      walls: AmbientLightDocument["walls"];
      vision: AmbientLightDocument["vision"];
      "config.dim": AmbientLightDocument["config"]["dim"];
      "config.bright": AmbientLightDocument["config"]["bright"];
      "config.angle": AmbientLightDocument["config"]["angle"];
      "config.color": AmbientLightDocument["config"]["color"];
      "config.alpha": AmbientLightDocument["config"]["alpha"];
      "config.darkness.min": AmbientLightDocument["config"]["darkness"]["min"];
      "config.darkness.max": AmbientLightDocument["config"]["darkness"]["max"];
      "config.animation.type": AmbientLightDocument["config"]["animation"]["type"];
      "config.animation.speed": AmbientLightDocument["config"]["animation"]["speed"];
      "config.animation.reverse": AmbientLightDocument["config"]["animation"]["reverse"];
      "config.animation.intensity": AmbientLightDocument["config"]["animation"]["intensity"];
      "config.coloration": AmbientLightDocument["config"]["coloration"];
      "config.luminosity": AmbientLightDocument["config"]["luminosity"];
      "config.attenuation": AmbientLightDocument["config"]["attenuation"];
      "config.saturation": AmbientLightDocument["config"]["saturation"];
      "config.contrast": AmbientLightDocument["config"]["contrast"];
      "config.shadows": AmbientLightDocument["config"]["shadows"];
    }
  }
}
