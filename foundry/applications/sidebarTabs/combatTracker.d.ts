/**
 * The combat and turn order tracker tab
 */
declare class CombatTracker extends SidebarTab {
  constructor(options?: Partial<Application.Options>);

  /**
   * Record a reference to the currently highlighted Token
   * @defaultValue `null`
   */
  protected _highlighted: Token | null;

  /**
   * Record the currently tracked Combat encounter
   * @defaultValue `null`
   */
  combat: Combat | null;

  /**
   * @override
   */
  static get defaultOptions(): CombatTracker.Options;

  /**
   * @override
   */
  createPopout(): CombatTracker;

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

  /**
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<CombatTracker.Data>;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Handle new Combat creation request
   */
  protected _onCombatCreate(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle a Combat deletion request
   * @remarks This is never called
   */
  protected _onCombatDelete(event: Event): Promise<void>;

  /**
   * Handle a Combat cycle request
   */
  protected _onCombatCycle(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle click events on Combat control buttons
   * @param event - The originating mousedown event
   */
  protected _onCombatControl(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle a Combatant control toggle
   * @param event - The originating mousedown event
   */
  protected _onCombatantControl(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle toggling the defeated status effect on a combatant Token
   * @param c - The combatant data being modified
   */
  protected _onToggleDefeatedStatus(c: Combat.Combatant): Promise<void>;

  /**
   * Handle mouse-down event on a combatant name in the tracker
   * @param event - The originating mousedown event
   * @returns A Promise that resolves once the pan is complete
   */
  protected _onCombatantMouseDown(event: JQuery.ClickEvent): Promise<void> | void;

  /**
   * Handle mouse-hover events on a combatant in the tracker
   */
  protected _onCombatantHover(event: JQuery.MouseEnterEvent): void;

  /**
   * Handle mouse-unhover events for a combatant in the tracker
   */
  protected _onCombatantHoverOut(event: JQuery.MouseLeaveEvent): void;

  /**
   * Default folder context actions
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get the sidebar directory entry context options
   * @returns The sidebar entry context options
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];

  /**
   * Display a dialog which prompts the user to enter a new initiative value for a Combatant
   */
  protected _onConfigureCombatant(li: JQuery): void;
}

declare namespace CombatTracker {
  type Data = {
    user: User;
    started: boolean;
    settings: CombatTrackerConfig.Setting;
  } & (
    | {
        combats: [];
        currentIndex: -1;
        combatCount: 0;
        hasCombat: false;
        combat: null;
        turns: [];
        previousId: null;
        nextId: null;
        control: false;
      }
    | {
        combats: Combat[];
        currentIndex: number;
        combatCount: number;
        hasCombat: true;
        combat: Combat;
        turns: Turn[];
        previousId: string | null;
        nextId: string | null;
        round: number;
        turn: number;
        control: boolean;
      }
  );

  interface Options extends SidebarTab.Options {
    /**
     * @defaultValue `'combat'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/combat-tracker.html'`
     */
    template: string;

    /**
     * @defaultValue `'Combat Tracker'`
     */
    title: string;

    /**
     * @defaultValue `['.directory-list']`
     */
    scrollY: string[];
  }

  type Turn = Duplicated<Combat.Combatant> & {
    effects: Set<unknown>;
    active: boolean;
    css: string;
    hasRolled: boolean;
    hasResource: boolean;
  };
}
