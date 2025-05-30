import type ContextMenu from "#client/applications/ux/context-menu.mjs";
import type { DeepPartial, Identity } from "../../../../../utils/index.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CombatTracker: CombatTracker.Any;
    }
  }
}

/**
 * An Application that manages switching between Combats and tracking the Combatants in those Combats.
 * @remarks TODO: Stub
 */
declare class CombatTracker<
  RenderContext extends CombatTracker.RenderContext = CombatTracker.RenderContext,
  Configuration extends CombatTracker.Configuration = CombatTracker.Configuration,
  RenderOptions extends CombatTracker.RenderOptions = CombatTracker.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  static override tabName: "combat";

  // leaving out DEFAULT_OPTIONS and PARTS

  /**
   * The list combats applicable to the active Scene.
   */
  get combats(): Combat.Stored[];

  /**
   * Record the currently tracked combat encounter.
   */
  get viewed(): Combat.Stored | null;

  set viewed(combat);

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Format a tooltip for displaying overflowing effects
   * @param effects - The effect names and icons.
   */
  protected _formatEffectsTooltip(effects: CombatTracker.EffectContext[]): void;

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

  protected override _preparePartContext(
    partId: string,
    context: HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>,
    options: RenderOptions,
  ): Promise<HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>>;

  /**
   * Prepare render context for the footer part.
   */
  protected _prepareCombatContext(context: RenderContext, options: RenderOptions): Promise<CombatTracker.CombatContext>;

  /**
   * Prepare render context for the tracker part.
   */
  protected _prepareTrackerContext(
    context: RenderContext,
    options: RenderOptions,
  ): Promise<CombatTracker.TrackerContext | void>;

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
   */
  protected _onCombatCycle(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<Combat.Stored>;

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
  protected _onPanToCombatant(combatant: Combatant.Stored): void;

  /**
   * Handle pinging a combatant's token.
   * @param combatant - The combatant.
   */
  protected _onPingCombatant(combatant: Combatant.Stored): void;

  /**
   * Handle rolling initiative for a single combatant.
   * @param combatant - The combatant.
   */
  protected _onRollInitiative(combatant: Combatant.Stored): void;

  /**
   * Handle toggling the defeated status effect on a combatant token.
   * @param combatant - The combatant.
   */
  protected _onToggleDefeatedStatus(combatant: Combatant.Stored): void;

  /**
   * Toggle a combatant's hidden state in the tracker.
   * @param combatant - The combatant.
   */
  protected _onToggleHidden(combatant: Combatant.Stored): void;

  /**
   * Handle updating a combatant's initiative in-sheet.
   * @param event - The triggering change event.
   */
  protected _onUpdateInitiative(event: Event): void;

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
   * @deprecated since v13, will be removed in v13
   * @remarks "CombatTracker#initialize is deprecated.
   * The currently viewed combat can be changed by assigning to ui.combat.viewed directly,
   * passed as an option to ui.combat.render, or by setting a Combat as active.
   */
  initialize(options: unknown): void;
}

declare namespace CombatTracker {
  interface Any extends AnyCombatTracker {}
  interface AnyConstructor extends Identity<typeof AnyCombatTracker> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}

  interface EffectContext {
    name: string;
    img: string;
  }

  interface CombatContext {
    combat: Combat.Stored | null;
    hasCombat: boolean;
    combats: CombatsRow[];
    control: boolean;
    css: string;
    currentIndex: number;
    displayCycle: boolean;
    initiativeIcon: string;
    link: boolean;
    labels: CombatLabels;
  }

  interface CombatsRow {
    id: string;
    label: number;
    active: boolean;
  }

  interface CombatLabels {
    scope: string;
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
    initiative: number | null;
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
