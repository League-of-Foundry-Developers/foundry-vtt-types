declare global {
  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends FormApplication.Options = FormApplication.Options,
    Data extends DefaultTokenConfig.Data = DefaultTokenConfig.Data
  > extends FormApplication<Options, Data, foundry.data.TokenData['toObject']> {
    constructor(object: unknown, options: Options);

    data: foundry.data.TokenData;

    override object: foundry.data.TokenData['toObject'];

    /**
     * The named world setting that stores the default Token configuration
     */
    static SETTING: string;

    /**
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
    static override get defaultOptions(): typeof FormApplication['defaultOptions'];

    override getData(options: unknown): Promise<Data>;

    override _getSubmitData(
      updateData?: Parameters<FormApplication['_getSubmitData']>[0]
    ): ReturnType<FormApplication['_getSubmitData']>;

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
