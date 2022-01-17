import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Combat documents.
   */
  class CombatTracker<Options extends ApplicationOptions = CombatTracker.Options> extends SidebarTab<Options> {
    constructor(options?: Partial<Options>);

    /**
     * Record a reference to the currently highlighted Token
     * @defaultValue `null`
     * @internal
     */
    protected _highlighted: ConfiguredObjectClassForName<'Token'> | null;

    /**
     * Record the currently tracked Combat encounter
     * @defaultValue `null`
     */
    viewed: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Combat>>> | null;

    /** @override */
    static get defaultOptions(): CombatTracker.Options;

    /**
     * Return an array of Combat encounters which occur within the current Scene.
     */
    get combats(): ReturnType<CombatEncounters['filter']>;

    /** @override */
    createPopout(): this;

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

    /** @override */
    getData(options?: Partial<Options>): Promise<CombatTracker.Data>;

    /** @override */
    activateListeners(html: JQuery): void;

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
     * Attach context menu options to elements in the tracker
     * @param html - The HTML element to which context options are attached
     * @internal
     */
    protected _contextMenu(html: JQuery): void;

    /**
     * Get the sidebar directory entry context options
     * @returns The sidebar entry context options
     * @internal
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * Display a dialog which prompts the user to enter a new initiative value for a Combatant
     * @internal
     */
    protected _onConfigureCombatant(li: JQuery): void;
  }

  namespace CombatTracker {
    type Data =
      | {
          user: Game['user'];
          combats: CombatTracker['combats'];
          combatCount: number;
          started: boolean;
          settings: ClientSettings.Values[`core.${typeof Combat.CONFIG_SETTING}`];
          currentIndex: -1;
          hasCombat: false;
          combat: null;
          turns: [];
          previousId: null;
          nextId: null;
          control: false;
        }
      | {
          user: Game['user'];
          combats: CombatTracker['combats'];
          combatCount: number;
          started: boolean;
          settings: ClientSettings.Values[`core.${typeof Combat.CONFIG_SETTING}`];
          currentIndex: number;
          hasCombat: true;
          combat: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Combat>>>;
          turns: Turn[];
          previousId: string | null;
          nextId: string | null;
          control: boolean;
          round: number;
          turn: number;
        };

    type Turn = {
      id: string;
      name: string;
      img: string;
      active: boolean;
      owner: boolean;
      defeated: boolean;
      hidden: boolean;
      initiative: number | null;
      hasRolled: boolean;
      hasResource: boolean;
      ressource: `${number}` | number | boolean | null;
      css: string;
      effects: Set<string>;
    };

    interface Options extends ApplicationOptions {
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
  }
}
