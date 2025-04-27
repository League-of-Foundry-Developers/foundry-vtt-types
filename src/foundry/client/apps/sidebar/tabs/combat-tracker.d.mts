import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Combat documents.
   */
  class CombatTracker<Options extends Application.Options = Application.Options> extends SidebarTab<Options> {
    constructor(options?: Partial<Options>);

    /**
     * Record a reference to the currently highlighted Token
     * @defaultValue `null`
     * @internal
     */
    protected _highlighted: Token.Object | null;

    /**
     * Record the currently tracked Combat encounter
     * @defaultValue `null`
     */
    viewed: Combat.Stored | null;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "combat",
     *   template: "templates/sidebar/combat-tracker.html",
     *   title: "COMBAT.SidebarTitle",
     *   scrollY: [".directory-list"]
     * })
     * ```
     */
    static get defaultOptions(): Application.Options;

    /**
     * Return an array of Combat encounters which occur within the current Scene.
     */
    get combats(): Combat.Stored[];

    override createPopout(): this;

    /**
     * Initialize the combat tracker to display a specific combat encounter.
     * If no encounter is provided, the tracker will be initialized with the first encounter in the viewed scene.
     * @param combat - The combat encounter to initialize
     *                 (default: `null`)
     * @param render - Whether to re-render the sidebar after initialization
     *                 (default: `true`)
     */
    initialize({ combat, render }?: { combat?: Combat.Implementation | null; render?: boolean }): void;

    /**
     * Scroll the combat log container to ensure the current Combatant turn is centered vertically
     */
    scrollToTurn(): void;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    /**
     * Retrieve a source image for a combatant.
     * @param combatant - The combatant queried for image.
     * @returns The source image attributed for this combatant.
     */
    protected _getCombatantThumbnail(combatant: Combatant.Implementation): Promise<string>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle new Combat creation request
     * @internal
     */
    protected _onCombatCreate(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle a Combat cycle request
     * @internal
     */
    protected _onCombatCycle(event: Event): Promise<void>;

    /**
     * Handle click events on Combat control buttons
     * @param event - The originating mousedown event
     * @internal
     */
    protected _onCombatControl(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle a Combatant control toggle
     * @param event - The originating mousedown event
     * @internal
     */
    protected _onCombatantControl(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle toggling the defeated status effect on a combatant Token
     * @param combatant - The combatant data being modified
     * @returns A Promise that resolves after all operations are complete
     * @internal
     */
    protected _onToggleDefeatedStatus(combatant: Combatant.Implementation): Promise<void>;

    /**
     * Handle pinging a combatant Token
     * @param combatant - The combatant data
     */
    protected _onPingCombatant(combatant: Combatant.Implementation): Promise<number | undefined>;

    /**
     * Handle mouse-down event on a combatant name in the tracker
     * @param event - The originating mousedown event
     * @returns A Promise that resolves once the pan is complete
     * @internal
     */
    protected _onCombatantMouseDown(event: JQuery.ClickEvent): Promise<boolean | void>;

    /**
     * Handle mouse-hover events on a combatant in the tracker
     * @internal
     */
    protected _onCombatantHoverIn(event: JQuery.MouseEnterEvent): void;

    /**
     * Handle mouse-unhover events for a combatant in the tracker
     * @internal
     */
    protected _onCombatantHoverOut(event: JQuery.MouseLeaveEvent): void;

    /**
     * Highlight a hovered combatant in the tracker.
     * @param combatant - The Combatant
     * @param hover     - Whether they are being hovered in or out.
     */
    hoverCombatant(combatant: Combatant.Implementation, hover: boolean): void;
    /**
     * Attach context menu options to elements in the tracker
     * @param html - The HTML element to which context options are attached
     * @internal
     */
    protected _contextMenu(html: JQuery): void;

    /**
     * Get the Combatant entry context options
     * @returns The Combatant entry context options
     * @internal
     */
    protected _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];

    /**
     * Display a dialog which prompts the user to enter a new initiative value for a Combatant
     * @internal
     */
    protected _onConfigureCombatant(li: JQuery): void;
  }

  namespace CombatTracker {
    interface Any extends AnyCombatTracker {}
    interface AnyConstructor extends Identity<typeof AnyCombatTracker> {}
  }
}

declare abstract class AnyCombatTracker extends CombatTracker<Application.Options> {
  constructor(...args: never);
}
