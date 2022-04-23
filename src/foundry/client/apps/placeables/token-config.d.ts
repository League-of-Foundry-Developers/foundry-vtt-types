import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import type { TokenBarData } from '../../../common/data/data.mjs/tokenBarData';

declare global {
  /**
   * The Application responsible for configuring a single Token document within a parent Scene.
   * Note that due to an oversight, this class does not inherit from {@link DocumentSheet} as it was intended to, and will
   * be changed in v10.
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class TokenConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends object = TokenConfig.Data<Options>
  > extends FormApplication<
    Options,
    Data,
    InstanceType<ConfiguredDocumentClassForName<'Token'>> | InstanceType<ConfiguredDocumentClassForName<'Actor'>>
  > {
    constructor(
      object:
        | InstanceType<ConfiguredDocumentClassForName<'Token'>>
        | InstanceType<ConfiguredDocumentClassForName<'Actor'>>,
      options?: Partial<Options>
    );

    token: InstanceType<ConfiguredDocumentClassForName<'Token'>> | PrototypeTokenDocument;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "token-sheet"],
     *   template: "templates/scene/token-config.html",
     *   width: 480,
     *   height: "auto",
     *   tabs: [
     *     {navSelector: '.tabs[data-group="main"]', contentSelector: "form", initial: "character"},
     *     {navSelector: '.tabs[data-group="light"]', contentSelector: '.tab[data-tab="light"]', initial: "basic"}
     *   ],
     *   sheetConfig: true
     * })
     * ```
     */
    static override get defaultOptions(): FormApplicationOptions;

    override get id(): string;

    /**
     * A convenience accessor to test whether we are configuring the prototype Token for an Actor.
     */
    get isPrototype(): boolean;

    /**
     * Convenience access to the Actor document that this Token represents
     */
    get actor(): InstanceType<ConfiguredDocumentClassForName<'Actor'>>;

    override get title(): string;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<this>;

    protected override _renderInner(...args: [Data]): Promise<JQuery>;

    /**
     * Get an Object of image paths and filenames to display in the Token sheet
     * @internal
     */
    protected _getAlternateTokenImages(): Promise<Record<string, string>>;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    /**
     * Shim for {@link DocumentSheet#_onConfigureSheet} that will be replaced in v10 when this class subclasses it.
     * @internal
     */
    protected _onConfigureSheet(event: JQuery.ClickEvent): void;

    override activateListeners(html: JQuery): void;

    protected override _updateObject(event: Event, formData: TokenConfig.FormData): Promise<unknown>;

    /**
     * Handle Token assignment requests to update the default prototype Token
     * @param event - The left-click event on the assign token button
     * @internal
     */
    protected _onAssignToken(event: JQuery.ClickEvent): void;

    /**
     * Handle changing the attribute bar in the drop-down selector to update the default current and max value
     * @internal
     */
    protected _onBarChange(ev: JQuery.ChangeEvent): void;
  }

  namespace TokenConfig {
    interface Attributes {
      bar: string[][];
      value: string[][];
    }

    interface Data<Options extends FormApplicationOptions = FormApplicationOptions> {
      cssClasses: string;
      isPrototype: boolean;
      hasAlternates: boolean;
      alternateImages: Record<string, string> | [];
      object: foundry.data.PrototypeTokenData | foundry.data.TokenData;
      options: Options;
      gridUnits: string;
      barAttributes: Record<string, string[]>;
      bar1: ReturnType<TokenDocument['getBarAttribute']> | undefined;
      bar2: ReturnType<TokenDocument['getBarAttribute']> | undefined;
      colorationTechniques: AdaptiveLightingShader.ColorationTechniques;
      displayModes: Record<foundry.CONST.TOKEN_DISPLAY_MODES, string>;
      actors: { _id: string; name: string }[];
      dispositions: Record<foundry.CONST.TOKEN_DISPOSITIONS, string>;
      lightAnimations: { [Key in keyof typeof CONFIG.Canvas.lightAnimations]: string } & { '': string };
      isGM: boolean;
    }

    interface FormData {
      actorId: string;
      actorLink: boolean;
      alternateImages?: string;
      alpha: number;
      'bar1.attribute': string;
      'bar2.attribute': string;
      brightLight: number | null;
      brightSight: number | null;
      dimLight: number | null;
      dimSight: number | null;
      displayBars: foundry.CONST.TOKEN_DISPLAY_MODES;
      displayName: foundry.CONST.TOKEN_DISPLAY_MODES;
      disposition: foundry.CONST.TOKEN_DISPOSITIONS;
      elevation: number | null;
      height: number | null;
      img: string;
      lightAlpha: number;
      lightAngle: number | null;
      'lightAnimation.intensity': number;
      'lightAnimation.speed': number;
      'lightAnimation.type': string;
      lightColor: string;
      lockRotation: boolean;
      mirrorX: boolean;
      mirrorY: boolean;
      name: StringTerm;
      rotation: number | null;
      scale: number;
      sightAngle: number | null;
      tint: string;
      vision: boolean;
      width: number | null;
      x: number | null;
      y: number | null;
    }
  }

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
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/scene/default-token-config.html",
     *   sheetConfig: false
     * })
     * ```
     */
    static override get defaultOptions(): FormApplicationOptions;

    override get id(): string;

    override get title(): string;

    override getData(options: unknown): Data | Promise<Data>;

    override _getSubmitData(
      updateData?: Parameters<TokenConfig['_getSubmitData']>[0]
    ): ReturnType<TokenConfig['_getSubmitData']>;

    override _updateObject(event: Event, formData?: object): Promise<unknown>;

    override activateListeners(html: JQuery): void;

    /**
     * Reset the form to default values
     */
    reset(): void;

    protected override _onBarChange(): Promise<void>;
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
