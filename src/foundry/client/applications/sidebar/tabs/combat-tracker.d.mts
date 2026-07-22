import type ContextMenu from "#client/applications/ux/context-menu.mjs";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { DeepPartial, Identity } from "../../../../../utils/index.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CombatTracker: CombatTracker.Any;
    }
  }
}

/**
 * An Application that manages switching between Combats and tracking the Combatants in those Combats.
 */
declare class CombatTracker<
  RenderContext extends CombatTracker.RenderContext = CombatTracker.RenderContext,
  Configuration extends CombatTracker.Configuration = CombatTracker.Configuration,
  RenderOptions extends CombatTracker.RenderOptions = CombatTracker.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     title: "COMBAT.SidebarTitle"
   *   },
   *   actions: {
   *     activateCombatant: CombatTracker.#onCombatantMouseDown,
   *     cycleCombat: CombatTracker.#onCombatCycle,
   *     createCombat: CombatTracker.#onCombatCreate,
   *     editName: CombatTracker.#onEditName,
   *     panToCombatant: CombatTracker.#onCombatantControl,
   *     pingCombatant: CombatTracker.#onCombatantControl,
   *     rollInitiative: CombatTracker.#onCombatantControl,
   *     toggleDefeated: CombatTracker.#onCombatantControl,
   *     toggleHidden: CombatTracker.#onCombatantControl,
   *     trackerSettings: CombatTracker.#onConfigure
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CombatTracker.DefaultOptions;

  static override tabName: "combat";

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     template: "templates/sidebar/tabs/combat/header.hbs"
   *   },
   *   tracker: {
   *     template: "templates/sidebar/tabs/combat/tracker.hbs",
   *     scrollable: [""]
   *   },
   *   footer: {
   *     template: "templates/sidebar/tabs/combat/footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The list combats applicable to the active Scene.
   */
  get combats(): Combat.Stored[];

  /**
   * Record the currently tracked combat encounter.
   */
  get viewed(): Combat.Stored | null;

  set viewed(combat);

  /**
   * The Scene linked to the currently viewed Combat, if any
   */
  get scene(): Combat.Stored["scene"] | null;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Format a tooltip for displaying overflowing effects
   * @param effects - The effect names and icons.
   */
  protected _formatEffectsTooltip(effects: CombatTracker.EffectContext[]): string;

  /**
   * Retrieve a source image for a combatant. If it is a video, use the first frame.
   * @param combatant - The Combatant.
   * @returns The image URL.
   */
  protected _getCombatantThumbnail(combatant: Combatant.Stored): Promise<string>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the footer part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareCombatContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the tracker part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareTrackerContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for a single entry in the combat tracker.
   * @param combat    - The active combat.
   * @param combatant - The Combatant whose turn is being prepared.
   * @param index     - The index of this entry in the turn order.
   */
  protected _prepareTurnContext(
    combat: Combat.Stored,
    combatant: Combatant.Stored,
    index: number,
  ): Promise<CombatTracker.TurnContext>;

  protected override _attachFrameListeners(): void;

  /**
   * Get context menu entries for Combatants in the tracker.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Get context menu entries for Combat in the tracker.
   */
  protected _getCombatContextOptions(): ContextMenu.Entry<HTMLElement>[];

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<void>;

  /**
   * Cycle to a different combat encounter in the tracker.
   * @param event  - The triggering event.
   * @param target - The action target element.
   * @remarks `undefined` when `target.dataset.combatId` is not a known combat.
   */
  protected _onCombatCycle(
    event: PointerEvent,
    target: ApplicationV2.ActionTarget,
  ): Promise<Combat.Implementation[]> | undefined;

  /**
   * Create a new combat.
   * @param event  - The triggering event.
   * @param target - The action target element.
   */
  protected _onCombatCreate(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<void>;

  /**
   * Handle performing some action for an individual combatant.
   * @param event  - The triggering event.
   * @param target - The action target element.
   */
  protected _onCombatantControl(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<unknown>;

  /**
   * Handle hovering over a combatant in the tracker.
   * @param event - The triggering event
   */
  protected _onCombatantHoverIn(event: PointerEvent): void;

  /**
   * Handle hovering out a combatant in the tracker.
   * @param event - The triggering event
   */
  protected _onCombatantHoverOut(event: PointerEvent): void;

  /**
   * Handle activating a combatant in the tracker.
   * @param event  - The triggering event.
   * @param target - The action target element.
   */
  protected _onCombatantMouseDown(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  /**
   * Handle panning to a combatant's token.
   * @param combatant - The combatant.
   */
  protected _onPanToCombatant(combatant: Combatant.Stored): CanvasAnimation.AnimateReturn | void;

  /**
   * Handle pinging a combatant's token.
   * @param combatant - The combatant.
   */
  protected _onPingCombatant(combatant: Combatant.Stored): Promise<boolean> | void;

  /**
   * Handle rolling initiative for a single combatant.
   * @param combatant - The combatant.
   */
  protected _onRollInitiative(combatant: Combatant.Stored): Promise<Combat.Stored>;

  /**
   * Handle toggling the defeated status effect on a combatant token.
   * @param combatant - The combatant.
   */
  protected _onToggleDefeatedStatus(combatant: Combatant.Stored): Promise<void>;

  /**
   * Toggle a combatant's hidden state in the tracker.
   * @param combatant - The combatant.
   */
  protected _onToggleHidden(combatant: Combatant.Stored): Promise<Combatant.Stored | undefined>;

  /**
   * The CombatTracker application is not a `<form>` element by default, but it does handle specific input events.
   * @param event - The triggering change event.
   */
  protected _onChangeInput(event: Event): Promise<Combatant.Stored | undefined> | void;

  /**
   * Handle updating a combatant's initiative in-sheet.
   * @param event - The triggering change event.
   */
  protected _onUpdateInitiative(event: Event): Promise<Combatant.Stored | undefined> | void;

  /**
   * Highlight a hovered combatant in the tracker.
   * @param combatant - The Combatant.
   * @param hover     - Whether they are being hovered in or out.
   */
  hoverCombatant(combatant: Combatant.Stored, hover: boolean): void;

  /**
   * Is the token of the combatant visible?
   * @param token - The token of the combatant
   * @returns Is the token visible?
   */
  protected _isTokenVisible(token: Token.Implementation): boolean;

  /**
   * Scroll to the current combatant in the combat log.
   */
  scrollToTurn(): void;

  /**
   * @deprecated since v13, until v15
   * @remarks "CombatTracker#initialize is deprecated.
   * The currently viewed combat can be changed by assigning to ui.combat.viewed directly,
   * passed as an option to ui.combat.render, or by setting a Combat as active.
   */
  initialize(options: unknown): void;

  #CombatTracker: true;
}

declare namespace CombatTracker {
  interface Any extends AnyCombatTracker {}
  interface AnyConstructor extends Identity<typeof AnyCombatTracker> {}

  /**
   * @remarks The `combat`/`hasCombat`/`nextId`/`previousId`/`combats`/`control`/`css`/`currentIndex`/`displayCycle`/
   * `initiativeIcon`/`linked` fields are added by {@linkcode CombatTracker._prepareCombatContext | #_prepareCombatContext}
   * (only for the `header` and `footer` parts); the `turns`/`hasDecimals` fields are added by
   * {@linkcode CombatTracker._prepareTrackerContext | #_prepareTrackerContext} (only for the `tracker` part, and only
   * when there's a {@linkcode CombatTracker.viewed | viewed} Combat).
   */
  type RenderContext = HandlebarsApplicationMixin.RenderContext &
    AbstractSidebarTab.RenderContext &
    Partial<CombatContext> &
    Partial<TrackerContext>;

  interface Configuration<CombatTracker extends CombatTracker.Any = CombatTracker.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<CombatTracker> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CombatTracker extends CombatTracker.Any = CombatTracker.Any> = DeepPartial<
    Configuration<CombatTracker>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}

  interface EffectContext {
    name: string;
    img: string;
  }

  interface CombatContext {
    combat: Combat.Stored | null;
    hasCombat: boolean;
    nextId: string | undefined;
    previousId: string | undefined;
    combats: CombatsRow[];
    control: boolean | undefined;
    css: string;
    currentIndex: number;
    displayCycle: boolean;
    initiativeIcon: CONFIG.Combat.InitiativeIcon;

    /** @remarks Whether the viewed Combat is linked to a Scene; note that this is `true` when there is no viewed Combat */
    linked: boolean;
  }

  interface CombatsRow {
    id: string;
    name: string;
    label: number;
    active: boolean;
  }

  interface TrackerContext {
    turns: TurnContext[];
    hasDecimals: boolean;
  }

  interface TurnContext {
    hasDecimals: boolean;
    hidden: boolean;
    id: string;
    isDefeated: boolean;

    /**
     * @remarks A plain number as returned by {@linkcode CombatTracker._prepareTurnContext | #_prepareTurnContext},
     * but reformatted to a fixed-precision string by {@linkcode CombatTracker._prepareTrackerContext | #_prepareTrackerContext}
     * before being passed to the `tracker` part's template
     */
    initiative: number | string | null;
    isOwner: boolean;
    name: string;
    resource: Combatant.Resource;
    active: boolean;
    canPing: boolean;
    img: string;
    css: string;
    effects: TurnEffects;
  }

  interface TurnEffects {
    icons: EffectContext[];
    tooltip: string;
  }
}

declare abstract class AnyCombatTracker extends CombatTracker<
  CombatTracker.RenderContext,
  CombatTracker.Configuration,
  CombatTracker.RenderOptions
> {
  constructor(...args: never);
}

export default CombatTracker;
