import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import CombatTracker = foundry.applications.sidebar.tabs.CombatTracker;
import ContextMenu = foundry.applications.ux.ContextMenu;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Token = foundry.canvas.placeables.Token;

const tracker = new CombatTracker();

expectTypeOf(CombatTracker.DEFAULT_OPTIONS).toEqualTypeOf<CombatTracker.DefaultOptions>();
expectTypeOf(CombatTracker.tabName).toEqualTypeOf<"combat">();
expectTypeOf(CombatTracker.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(tracker.combats).toEqualTypeOf<Combat.Stored[]>();
expectTypeOf(tracker.viewed).toEqualTypeOf<Combat.Stored | null>();
tracker.viewed = null;

declare const combat: Combat.Stored;
tracker.viewed = combat;

expectTypeOf(tracker.scene).toEqualTypeOf<Combat.Stored["scene"] | null>();

expectTypeOf(tracker.hoverCombatant(combat.combatants.contents[0]!, true)).toEqualTypeOf<void>();
expectTypeOf(tracker.scrollToTurn()).toEqualTypeOf<void>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(tracker.initialize({})).toEqualTypeOf<void>();

declare class _TestCombatTrackerSubclass extends CombatTracker {
  protected override _configureRenderOptions(options: DeepPartial<CombatTracker.RenderOptions>): void;

  protected override _formatEffectsTooltip(effects: CombatTracker.EffectContext[]): string;

  protected override _getCombatantThumbnail(combatant: Combatant.Stored): Promise<string>;

  protected override _onFirstRender(
    context: DeepPartial<CombatTracker.RenderContext>,
    options: DeepPartial<CombatTracker.RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CombatTracker.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _prepareCombatContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CombatTracker.RenderOptions>,
  ): Promise<void>;

  protected override _prepareTrackerContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CombatTracker.RenderOptions>,
  ): Promise<void>;

  protected override _prepareTurnContext(
    combat: Combat.Stored,
    combatant: Combatant.Stored,
    index: number,
  ): Promise<CombatTracker.TurnContext>;

  protected override _attachFrameListeners(): void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getCombatContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _isTokenVisible(token: Token.Implementation): boolean;
}

expectTypeOf(tracker).toEqualTypeOf<CombatTracker>();
