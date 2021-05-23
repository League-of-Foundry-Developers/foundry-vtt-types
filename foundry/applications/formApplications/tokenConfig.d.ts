/**
 * A Token Configuration Application
 * @typeParam P - the type of the options object
 */
declare class TokenConfig<P extends TokenConfig.Options = TokenConfig.Options> extends FormApplication<
  P,
  TokenConfig.Data,
  Token
> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "token-sheet"],
   *   template: "templates/scene/token-config.html",
   *   width: 480,
   *   height: "auto",
   *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "character"}]
   * });
   * ```
   */
  static get defaultOptions(): TokenConfig.Options;

  /**
   * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
   */
  static getTrackedAttributeChoices(attributes: TokenConfig.Attributes): Partial<Record<string, string[]>>;

  /**
   * Test whether an individual data object is a valid attribute - containing both a "value" and "max" field
   * @param data  - The data object to search
   * @param _path - The attribute path being recursed
   *                (default: `[]`)
   * @returns An object containing both bar and value attribute paths
   */
  protected static getTrackedAttributes(data: object, _path: string[]): TokenConfig.Attributes;

  /**
   * @param token   - The Token object for which settings are being configured
   * @param options - TokenConfig ui options (see Application)
   */
  constructor(token: Token, options?: Partial<P>);

  /**
   * Convenience access for the Token's linked Actor, if any
   */
  get actor(): this['token']['actor'];

  /** @override */
  get id(): string;

  /** @override */
  get title(): string;

  /**
   * Convenience access for the Token object
   */
  get token(): this['object'];

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<TokenConfig.Data>;

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * Get an Object of image paths and filenames to display in the Token sheet
   */
  protected _getAlternateTokenImages(): Promise<Partial<Record<string, string>>>;

  /** @override */
  protected _getSubmitData(
    updateData?: TokenConfig.FormData
  ): ReturnType<FormApplication['_getSubmitData']> & { lightAlpha: number };

  /**
   * Handle Token assignment requests to update the default prototype Token
   * @param event - The left-click event on the assign token button
   */
  protected _onAssignToken(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle changing the attribute bar in the drop-down selector to update the default current and max value
   */
  protected _onBarChange(ev: JQuery.ChangeEvent): Promise<void>;

  /**
   * Update certain fields of a linked actor token when token configuration is changed
   * @param tokenData - The new token data
   */
  protected _updateActorData(tokenData: TokenConfig.FormData): ReturnType<Actor['update']> | void;

  /** @override */
  protected _updateObject(event: Event, formData: TokenConfig.FormData): Promise<void>;
}

declare namespace TokenConfig {
  interface Attributes {
    bar: string[][];
    value: string[][];
  }

  interface Data {
    actors: Array<Pick<Actor, '_id' | 'name'>>;
    alternateImages: TokenConfig['_getAlternateTokenImages'] | [];
    bar1: ReturnType<TokenConfig['object']['getBarAttribute']>;
    bar2: ReturnType<TokenConfig['object']['getBarAttribute']>;
    barAttributes: ReturnType<typeof TokenConfig['getTrackedAttributeChoices']>;
    cssClasses: 'prototype' | '';
    displayModes: Record<Const.TokenDisplayMode, string>;
    dispositions: Record<Const.TokenDisposition, string>;
    gridUnits: Scene['data']['gridUnits'] | Game['system']['gridUnits'];
    hasAlternates: boolean;
    isGM: User['isGM'];
    isPrototype: Options['configureDefault'];
    lightAlpha: number;
    lightAnimations: { [Key in keyof typeof CONFIG['Canvas']['lightAnimations']]: string } & { '': 'None' };
    object: Duplicated<TokenConfig['token']['data']>;
    options: TokenConfig['options'];
  }

  interface FormData {
    actorId: Token.Data['actorId'];
    actorLink: Token.Data['actorLink'];
    alternateImages?: string;
    'bar1.attribute': Token.Data['bar1']['attribute'];
    'bar2.attribute': Token.Data['bar2']['attribute'];
    brightLight: Token.Data['brightLight'] | null;
    brightSight: Token.Data['brightSight'] | null;
    dimLight: Token.Data['dimLight'] | null;
    dimSight: Token.Data['dimSight'] | null;
    displayBars: Token.Data['displayBars'];
    displayName: Token.Data['displayName'];
    disposition: Token.Data['disposition'];
    elevation: Token.Data['elevation'] | null;
    height: Token.Data['height'] | null;
    img: Token.Data['img'];
    lightAlpha: Token.Data['lightAlpha'];
    lightAngle: Token.Data['lightAngle'] | null;
    'lightAnimation.intensity': Token.Data['lightAnimation']['intensity'];
    'lightAnimation.speed': Token.Data['lightAnimation']['speed'];
    'lightAnimation.type': Token.Data['lightAnimation']['type'];
    lightColor: Token.Data['lightColor'];
    lockRotation: Token.Data['lockRotation'];
    mirrorX: Token.Data['mirrorX'];
    mirrorY: Token.Data['mirrorY'];
    name: Token.Data['name'];
    rotation: Token.Data['rotation'] | null;
    scale: Token.Data['scale'];
    sightAngle: Token.Data['sightAngle'] | null;
    tint: Token.Data['tint'];
    vision: Token.Data['vision'];
    width: Token.Data['width'] | null;
    x: Token.Data['x'] | null;
    y: Token.Data['y'] | null;
  }

  interface Options extends FormApplication.Options {
    /**
     * Configure the default actor token on submit
     */
    configureDefault?: boolean;
  }
}
