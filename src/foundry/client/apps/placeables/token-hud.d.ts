import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Token objects.
   * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
   * @typeParam Options - the type of the options object
   */
  class TokenHUD<Options extends ApplicationOptions = ApplicationOptions> extends BasePlaceableHUD<
    ConcreteToken,
    Options
  > {
    /**
     * Track whether the status effects control palette is currently expanded or hidden
     * @defaultValue `false`
     * @internal
     */
    protected _statusEffects: boolean;

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "token-hud",
     *   template: "templates/hud/token-hud.html"
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override bind(object: ConcreteToken): void;

    /**
     * Refresh the currently active state of all status effect icons in the Token HUD selector.
     */
    refreshStatusIcons(): void;

    override setPosition(_position?: Partial<Application.Position>): void;

    override getData(options?: Partial<ApplicationOptions>): MaybePromise<object>;

    /**
     * Get an array of icon paths which represent valid status effect choices
     * @internal
     */
    protected _getStatusEffectChoices(): Record<
      string,
      {
        id: string;
        title: string | null;
        src: string;
        isActive: boolean;
        isOverlay: boolean;
        cssClass: string;
      }
    >;

    override activateListeners(html: JQuery): void;

    protected override _onClickControl(event: JQuery.ClickEvent): unknown;

    /**
     * Handle initial click to focus an attribute update field
     * @internal
     */
    protected _onAttributeClick(event: JQuery.ClickEvent): void;

    /**
     * Force field handling on an Enter keypress even if the value of the field did not change.
     * This is important to suppose use cases with negative number values.
     * @param event - The originating keydown event
     * @internal
     */
    protected _onAttributeKeydown(event: JQuery.KeyDownEvent): void;

    /**
     * Handle attribute bar update
     * @internal
     */
    protected _onAttributeUpdate(event: JQuery.FocusOutEvent): void;

    /**
     * Toggle Token combat state
     * @internal
     */
    protected _onToggleCombat(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle Token configuration button click
     * @internal
     */
    protected _onTokenConfig(event: JQuery.ClickEvent): void;

    /**
     * Handle left-click events to toggle the displayed state of the status effect selection palette
     * @internal
     */
    protected _onToggleStatusEffects(event: JQuery.ClickEvent): void;

    /**
     * Assign css selectors for the active state of the status effects selection palette
     * @internal
     */
    protected _toggleStatusEffects(active: boolean): void;

    /**
     * Handle toggling a token status effect icon
     * @internal
     */
    protected _onToggleEffect(
      event: JQuery.ClickEvent | JQuery.ContextMenuEvent,
      {
        overlay
      }?: {
        /** @defaultValue `@false` */
        overlay?: boolean;
      }
    ): Promise<boolean>;

    /**
     * Handle toggling the target state for this Token
     * @internal
     */
    protected _onToggleTarget(event: JQuery.ClickEvent): void;
  }
}

type ConcreteToken = InstanceType<ConfiguredObjectClassForName<"Token">>;
