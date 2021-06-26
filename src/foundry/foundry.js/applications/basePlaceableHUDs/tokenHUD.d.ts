/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Token objects.
 * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
 */
declare class TokenHUD extends BasePlaceableHUD<Token> {
  /**
   * Track whether the status effects control palette is currently expanded or hidden
   * @defaultValue `false`
   */
  protected _statusEffects: boolean;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "token-hud",
   *   template: "templates/hud/token-hud.html"
   * })
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  bind(object: Token): void;

  /**
   * Refresh the currently active state of all status effect icons in the Token HUD selector.
   */
  refreshStatusIcons(): void;

  /** @override */
  setPosition(_position?: Partial<Application.Position>): void;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.getData(), {
   *   canConfigure: game.user.can("TOKEN_CONFIGURE"),
   *   canToggleCombat: ui.combat !== null,
   *   displayBar1: bar1 && (bar1.type !== "none"),
   *   bar1Data: bar1,
   *   displayBar2: bar2 && (bar2.type !== "none"),
   *   bar2Data: bar2,
   *   visibilityClass: data.hidden ? "active" : "",
   *   effectsClass: this._statusEffects ? "active" : "",
   *   combatClass: this.object.inCombat ? "active" : "",
   *   targetClass: this.object.targeted.has(game.user) ? "active" : "",
   *   statusEffects: this._getStatusEffectChoices(data)
   * });
   * ```
   */
  getData(options?: Application.RenderOptions): ReturnType<BasePlaceableHUD<Token>['getData']> & {
    canConfigure: boolean;
    canToggleCombat: boolean;
    displayBar1: boolean;
    bar1Data: ReturnType<Token['getBarAttribute']>;
    displayBar2: boolean;
    bar2Data: ReturnType<Token['getBarAttribute']>;
    visibilityClass: 'active' | '';
    effectsClass: 'active' | '';
    combatClass: 'active' | '';
    targetClass: 'active' | '';
    statusEffects: ReturnType<TokenHUD['_getStatusEffectChoices']>;
  };

  /**
   * Get an array of icon paths which represent valid status effect choices
   */
  protected _getStatusEffectChoices(): Partial<
    Record<
      string,
      {
        id: string;
        isActive: boolean;
        isOverlay: boolean;
        src: string;
        title: string;
      }
    >
  >;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle initial click to focus an attribute update field
   */
  protected _onAttributeClick(event: JQuery.ClickEvent): void;

  /**
   * Force field handling on an Enter keypress even if the value of the field did not change.
   * This is important to suppose use cases with negative number values.
   * @param event - The originating keydown event
   */
  protected _onAttributeKeydown(event: JQuery.KeyDownEvent): void;

  /**
   * Handle attribute bar update
   */
  protected _onAttributeUpdate(event: JQuery.ChangeEvent): void;

  /**
   * Toggle Token combat state
   */
  protected _onToggleCombat(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle Token configuration button click
   */
  protected _onTokenConfig(event: JQuery.ClickEvent): void;

  /**
   * Handle left-click events to toggle the displayed state of the status effect selection palette
   */
  protected _onClickStatusEffects(event: JQuery.ClickEvent): void;

  /**
   * Assign css selectors for the active state of the status effects selection palette
   */
  protected _toggleStatusEffects(active: boolean): void;

  /**
   * Handle toggling a token status effect icon
   * @param overlay - (default: `false`)
   */
  protected _onToggleEffect(
    event: JQuery.ClickEvent | JQuery.ContextMenuEvent,
    { overlay }?: { overlay?: boolean }
  ): Promise<boolean>;

  /**
   * Handle toggling the target state for this Token
   */
  protected _onToggleTarget(event: JQuery.ClickEvent): void;
}
