import type { AnyObject, DeepPartial, Identity, IntentionalPartial, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;
import Token = foundry.canvas.placeables.Token;

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

  /** @defaultValue `"combat"` */
  static override tabName: string;

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
   *
   * @remarks Popouts share {@linkcode ui.combat}'s viewed encounter.
   */
  get viewed(): Combat.Stored | null;

  set viewed(combat);

  /**
   * The Scene linked to the currently viewed Combat, if any
   */
  get scene(): Scene.Stored | null;

  /**
   * @remarks Selects an explicit, active-scene, or recently modified encounter.
   */
  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Format a tooltip for displaying overflowing effects.
   * @param effects - The effect names and icons.
   *
   * @remarks The empty string when there are no effects, and otherwise the outer HTML of a `<ul>`.
   */
  protected _formatEffectsTooltip(effects: CombatTracker.EffectContext[]): string;

  /**
   * Retrieve a source image for a combatant. If it is a video, use the first frame.
   * @param combatant - The Combatant.
   * @returns The image URL.
   *
   * @remarks Falls back to {@linkcode foundry.CONST.DEFAULT_TOKEN} for a combatant with no image.
   */
  protected _getCombatantThumbnail(combatant: Combatant.Stored): Promise<string>;

  /**
   * @remarks Registers non-popouts and binds the available context menus.
   *
   * Fires the `getCombatantContextOptions` and `getCombatContextOptions` hooks.
   */
  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /** @remarks Scrolls the active combatant into view when a turn change moved it out of the visible area. */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the footer part.
   *
   * @remarks Shared by the header and footer parts.
   */
  protected _prepareCombatContext(
    context: CombatTracker.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for the tracker part.
   *
   * @remarks Formats all initiatives to a shared precision.
   */
  protected _prepareTrackerContext(
    context: CombatTracker.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for a single entry in the combat tracker.
   * @param combat    - The active combat.
   * @param combatant - The Combatant whose turn is being prepared.
   * @param index     - The index of this entry in the turn order.
   *
   * @remarks Marks the combatant defeated when it carries the configured defeated status, in which case that
   * effect is left out of the icon list.
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

  /**
   * @remarks Dispatches combat controls to the viewed encounter; other actions defer to the base.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<void>;

  /**
   * Cycle to a different combat encounter in the tracker.
   * @param event  - The triggering event.
   * @param target - The action target element.
   */
  protected _onCombatCycle(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<Combat.Stored> | undefined;

  /**
   * Create a new combat.
   * @param event  - The triggering event.
   * @param target - The action target element.
   *
   * @remarks Activates the new encounter without re-rendering, since creating it already triggers a render.
   */
  protected _onCombatCreate(event: PointerEvent, target: ApplicationV2.ActionTarget): Promise<void>;

  /**
   * Handle performing some action for an individual combatant.
   * @param event  - The triggering event.
   * @param target - The action target element.
   *
   * @privateRemarks Uses the dispatcher width because the delegated handler results are discarded.
   */
  protected _onCombatantControl(event: PointerEvent, target: ApplicationV2.ActionTarget): MaybePromise<void>;

  /**
   * Handle hovering over a combatant in the tracker.
   * @param event - The triggering event.
   *
   * @remarks Hovers out every other placeable, and records the token so the matching hover-out can reach it.
   */
  protected _onCombatantHoverIn(event: PointerEvent): void;

  /**
   * Handle hovering out a combatant in the tracker.
   * @param event - The triggering event.
   */
  protected _onCombatantHoverOut(event: PointerEvent): void;

  /**
   * Handle activating a combatant in the tracker.
   * @param event  - The triggering event.
   * @param target - The action target element.
   *
   * @remarks Double-click opens the actor sheet; input and button clicks are ignored.
   */
  protected _onCombatantMouseDown(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  /**
   * Handle panning to a combatant's token.
   * @param combatant - The combatant.
   *
   * @remarks Warns and does nothing when the token is on another scene or is not visible to the user.
   */
  protected _onPanToCombatant(combatant: Combatant.Stored): CanvasAnimation.AnimateReturn | void;

  /**
   * Handle pinging a combatant's token.
   * @param combatant - The combatant.
   *
   * @remarks Warns and does nothing when the token is on another scene or is not visible to the user.
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
   *
   * @remarks Also applies or clears the configured defeated status effect on the combatant's actor, as an overlay.
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
  protected _onChangeInput(event: Event): void;

  /**
   * Handle updating a combatant's initiative in-sheet.
   * @param event - The triggering change event.
   *
   * @remarks Supports relative values, replacement values, and blank-value clearing.
   */
  protected _onUpdateInitiative(event: Event): Promise<Combatant.Stored | undefined> | void;

  /**
   * Highlight a hovered combatant in the tracker.
   * @param combatant - The Combatant.
   * @param hover     - Whether they are being hovered in or out.
   *
   * @remarks Applies to the popped-out tracker as well, when one is rendered.
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
   * @deprecated since v13 until v15.
   * @remarks "`CombatTracker#initialize` is deprecated. The currently viewed combat can be changed by assigning to
   * `ui.combat.viewed` directly, passed as an option to `ui.combat.render`, or by setting a Combat as active."
   */
  initialize(options?: CombatTracker.InitializeOptions): void;

  #CombatTracker: true;

  static #CombatTrackerStatic: true;
}

declare namespace CombatTracker {
  interface Any extends AnyCombatTracker {}
  interface AnyConstructor extends Identity<typeof AnyCombatTracker> {}

  interface EffectContext {
    name: string;

    img: string;
  }

  /** One selectable encounter in the tracker's combat switcher. */
  interface CombatEntry {
    id: string;

    name: string;

    /** The encounter's one-based position in {@linkcode CombatTracker.combats}. */
    label: number;

    active: boolean;
  }

  interface TurnContext {
    /** Whether this combatant's own initiative has a fractional part. */
    hasDecimals: boolean;

    hidden: boolean;

    id: string;

    isDefeated: boolean;

    /**
     * @remarks A number as {@linkcode CombatTracker._prepareTurnContext} produces it, rewritten into a
     * fixed-precision string by {@linkcode CombatTracker._prepareTrackerContext} before the part is rendered.
     */
    initiative: number | string | null;

    isOwner: boolean;

    name: string;

    /** @remarks `null` for a combatant the user cannot observe. */
    resource: Combatant.Resource | null;

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

  interface InitializeOptions {
    /** @defaultValue `null` */
    combat?: Combat.Stored | null | undefined;

    /** @defaultValue `true` */
    render?: boolean | undefined;
  }

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      AbstractSidebarTab.RenderContext,
      IntentionalPartial<PreparePartContext> {}

  /** Members added by {@linkcode CombatTracker._preparePartContext | #_preparePartContext}. */
  interface PreparePartContext {
    /** @remarks Added for the header and footer parts. */
    combat: Combat.Stored | null;

    /** @remarks Added for the header and footer parts. */
    hasCombat: boolean;

    /** The encounter before the viewed one, absent when it is the first. */
    previousId: string | undefined;

    /** The encounter after the viewed one, absent when it is the last. */
    nextId: string | undefined;

    combats: CombatEntry[];

    /** Whether the current user may advance the turn or round. */
    control: boolean;

    css: string;

    /** The viewed encounter's one-based position, or `0` when none is viewed. */
    currentIndex: number;

    /** Whether to render the switcher as a cycler rather than as tabs, which it does past seven encounters. */
    displayCycle: boolean;

    initiativeIcon: string;

    /**
     * Whether the viewed encounter is bound to a scene.
     *
     * @remarks `true` when no encounter is viewed, since the check compares an absent scene against `null`.
     */
    linked: boolean;

    /** @remarks Added for the tracker part when an encounter is viewed. */
    turns: TurnContext[] | undefined;

    /** Whether any combatant's initiative has a fractional part. */
    hasDecimals: boolean | undefined;
  }

  interface Configuration<CombatTracker extends CombatTracker.Any = CombatTracker.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<CombatTracker> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CombatTracker extends CombatTracker.Any = CombatTracker.Any> = DeepPartial<
    Configuration<CombatTracker>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {
    /**
     * The encounter to view.
     *
     * @remarks Explicit `null` suppresses encounter inference.
     */
    combat?: Combat.Stored | null | undefined;

    /**
     * A string with the format `"{operation}{documentName}"` providing context.
     *
     * @remarks Supplied by document rendering workflows.
     */
    renderContext?: string | undefined;

    /** Data describing the document modification that occurred. */
    renderData?: AnyObject | AnyObject[] | undefined;
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
