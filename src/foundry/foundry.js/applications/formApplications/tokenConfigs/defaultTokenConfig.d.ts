import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';
import type { TokenBarData } from '../../../../common/data/data.mjs/tokenBarData';

declare global {
  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends DefaultTokenConfig.Data = DefaultTokenConfig.Data
  > extends TokenConfig<Options, Data> {
    constructor(object: unknown, options?: Partial<Options> | undefined);

    data: foundry.data.TokenData;

    object: InstanceType<ConfiguredDocumentClassForName<'Token'>>;

    token: InstanceType<ConfiguredDocumentClassForName<'Token'>>;

    /**
     * The named world setting that stores the default Token configuration
     * @defaultValue `"defaultToken"`
     */
    static SETTING: string;

    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/scene/default-token-config.html",
     *   sheetConfig: false
     * })
     * ```
     */
    static get defaultOptions(): FormApplicationOptions;

    /** @override */
    get id(): string;

    /** @override */
    get title(): string;

    /** @override */
    getData(options: unknown): Data | Promise<Data>;

    /** @override */
    _getSubmitData(
      updateData?: Parameters<TokenConfig['_getSubmitData']>[0]
    ): ReturnType<TokenConfig['_getSubmitData']>;

    /** @override */
    _updateObject(event: Event, formData?: object): Promise<unknown>;

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Reset the form to default values
     */
    reset(): void;

    /** @override */
    protected _onBarChange(): Promise<void>;
  }

  namespace DefaultTokenConfig {
    interface Data<Options extends FormApplicationOptions = FormApplicationOptions>
      extends Omit<TokenConfig.Data<Options>, 'object' | 'bar1' | 'bar2'> {
      object: foundry.data.TokenData['_source'];
      isDefault: true;
      barAttributes: ReturnType<typeof TokenDocument['getTrackedAttributeChoices']>;
      bar1: TokenBarData;
      bar2: TokenBarData;
    }
  }
}

export {};
