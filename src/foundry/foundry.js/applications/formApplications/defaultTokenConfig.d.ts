declare global {
  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends FormApplication.Options = FormApplication.Options
  > extends FormApplication<Options> {
    constructor(object: unknown, options: Options);

    data: foundry.data.TokenData;

    object: foundry.data.TokenData['toObject'];

    /**
     * The named world setting that stores the default Token configuration
     */
    static SETTING: string;

    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "default-token-config",
     *   classes: ["sheet"],
     *   template: "templates/scene/default-token-config.html",
     *   title: "Default Token Configuration",
     *   width: 480,
     *   height: "auto"
     * })
     * ```
     */
    static get defaultOptions(): typeof FormApplication['defaultOptions'];

    override getData(options: unknown): Promise<DefaultTokenConfig.Data>;

    override _getSubmitData(updateData?: DefaultTokenConfig.Data): DefaultTokenConfig.Data;

    override _updateObject(event: Event, formData?: object): Promise<unknown>;

    override activateListeners(html: JQuery): void;

    /**
     * Reset the form to default values
     */
    reset(): void;
  }

  namespace DefaultTokenConfig {
    interface Data {
      object: DefaultTokenConfig['object'];
      barAttributes: ReturnType<typeof TokenDocument['getTrackedAttributeChoices']>;
      dispositions: Record<ValueOf<typeof CONST.TOKEN_DISPOSITIONS>, string>;
      lightAnimations: Record<string, string>;
      displayModes: Record<ValueOf<typeof CONST.TOKEN_DISPLAY_MODES>, string>;
      lightAlpha: number;
    }
  }
}

export {};
