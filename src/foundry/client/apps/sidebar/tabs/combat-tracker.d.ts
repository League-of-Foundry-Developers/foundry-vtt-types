import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from "../../../../../types/helperTypes";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Combat documents.
   */
  class CombatTracker<Options extends ApplicationOptions = ApplicationOptions> extends SidebarTab<Options> {
    constructor(options?: Partial<Options>);

    /**
     * Record a reference to the currently highlighted Token
     * @defaultValue `null`
     * @internal
     */
    protected _highlighted: ConfiguredObjectClassForName<"Token"> | null;

    /**
     * Record the currently tracked Combat encounter
     * @defaultValue `null`
     */
    viewed: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Combat>>> | null;

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
    static get defaultOptions(): ApplicationOptions;

    /**
     * Return an array of Combat encounters which occur within the current Scene.
     */
    get combats(): StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Combat>>>[];

    override createPopout(): this;

    /**
     * Initialize the combat tracker to display a specific combat encounter.
     * If no encounter is provided, the tracker will be initialized with the first encounter in the viewed scene.
     * @param combat - The combat encounter to initialize
     *                 (default: `null`)
     * @param render - Whether to re-render the sidebar after initialization
     *                 (default: `true`)
     */
    initialize({ combat, render }?: { combat?: Combat | null; render?: boolean }): void;

    /**
     * Scroll the combat log container to ensure the current Combatant turn is centered vertically
     */
    scrollToTurn(): void;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle new Combat creation request
     * @internal
     */
    protected _onCombatCreate(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle a Combat deletion request
     * @internal
     * @remarks This is never called
     */
    protected _onCombatDelete(event: Event): Promise<void>;

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
    protected _onToggleDefeatedStatus(
      combatant: InstanceType<ConfiguredDocumentClass<typeof Combatant>>
    ): Promise<void>;

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
    hoverCombatant(combatant: InstanceType<ConfiguredDocumentClass<typeof Combatant>>, hover: boolean): void;
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
    protected _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * Display a dialog which prompts the user to enter a new initiative value for a Combatant
     * @internal
     */
    protected _onConfigureCombatant(li: JQuery): void;
  }
}
