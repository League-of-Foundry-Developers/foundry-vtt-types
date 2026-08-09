import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;
import CombatTracker = foundry.applications.sidebar.tabs.CombatTracker;
import ContextMenu = foundry.applications.ux.ContextMenu;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import Token = foundry.canvas.placeables.Token;

declare const tracker: CombatTracker;

expectTypeOf(tracker).toExtend<AbstractSidebarTab.Any>();

// Widened from the `"combat"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(CombatTracker.tabName).toBeString();
expectTypeOf(CombatTracker.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(tracker.combats).toEqualTypeOf<Combat.Stored[]>();
expectTypeOf(tracker.viewed).toEqualTypeOf<Combat.Stored | null>();
expectTypeOf(tracker.scene).toEqualTypeOf<Scene.Stored | null>();

declare const combat: Combat.Stored;
tracker.viewed = combat;
tracker.viewed = null;

declare const effects: CombatTracker.EffectContext[];
expectTypeOf(tracker["_formatEffectsTooltip"](effects)).toBeString();

declare const combatant: Combatant.Stored;
expectTypeOf(tracker["_getCombatantThumbnail"](combatant)).toEqualTypeOf<Promise<string>>();

declare const context: DeepPartial<CombatTracker.RenderContext>;
declare const options: DeepPartial<CombatTracker.RenderOptions>;
expectTypeOf(tracker["_configureRenderOptions"](options)).toBeVoid();
expectTypeOf(tracker["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tracker["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();

declare const partContext: CombatTracker.RenderContext;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;
expectTypeOf(tracker["_prepareCombatContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tracker["_prepareTrackerContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tracker["_prepareTurnContext"](combat, combatant, 0)).toEqualTypeOf<Promise<CombatTracker.TurnContext>>();

expectTypeOf(tracker["_attachFrameListeners"]()).toBeVoid();
expectTypeOf(tracker["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(tracker["_getCombatContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();

declare const pointerEvent: PointerEvent;
declare const actionTarget: ApplicationV2.ActionTarget;
expectTypeOf(tracker["_onClickAction"](pointerEvent, actionTarget)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tracker["_onCombatCycle"](pointerEvent, actionTarget)).toEqualTypeOf<Promise<Combat.Stored> | undefined>();
expectTypeOf(tracker["_onCombatCreate"](pointerEvent, actionTarget)).toEqualTypeOf<Promise<void>>();
// Declared at the click-action width: the runtime forwards five unrelated return types and the dispatcher
// awaits and discards the result.
expectTypeOf(tracker["_onCombatantControl"](pointerEvent, actionTarget)).toEqualTypeOf<MaybePromise<void>>();
expectTypeOf(tracker["_onCombatantMouseDown"](pointerEvent, actionTarget)).toBeVoid();
expectTypeOf(tracker["_onCombatantHoverIn"](pointerEvent)).toBeVoid();
expectTypeOf(tracker["_onCombatantHoverOut"](pointerEvent)).toBeVoid();

expectTypeOf(tracker["_onPanToCombatant"](combatant)).toEqualTypeOf<CanvasAnimation.AnimateReturn | void>();
expectTypeOf(tracker["_onPingCombatant"](combatant)).toEqualTypeOf<Promise<boolean> | void>();
expectTypeOf(tracker["_onRollInitiative"](combatant)).toEqualTypeOf<Promise<Combat.Stored>>();
expectTypeOf(tracker["_onToggleDefeatedStatus"](combatant)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tracker["_onToggleHidden"](combatant)).toEqualTypeOf<Promise<Combatant.Stored | undefined>>();

declare const event: Event;
expectTypeOf(tracker["_onChangeInput"](event)).toBeVoid();
expectTypeOf(tracker["_onUpdateInitiative"](event)).toEqualTypeOf<Promise<Combatant.Stored | undefined> | void>();

expectTypeOf(tracker.hoverCombatant(combatant, true)).toBeVoid();
expectTypeOf(tracker.scrollToTurn()).toBeVoid();

declare const token: Token.Implementation;
expectTypeOf(tracker["_isTokenVisible"](token)).toBeBoolean();

// `render({ combat })` is how a caller points the tracker at a specific encounter.
expectTypeOf<CombatTracker.RenderOptions["combat"]>().toEqualTypeOf<Combat.Stored | null | undefined>();

// Written by the header and footer parts.
expectTypeOf<CombatTracker.RenderContext["combat"]>().toEqualTypeOf<Combat.Stored | null | undefined>();
expectTypeOf<CombatTracker.RenderContext["combats"]>().toEqualTypeOf<CombatTracker.CombatEntry[] | undefined>();
expectTypeOf<CombatTracker.RenderContext["previousId"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<CombatTracker.RenderContext["nextId"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<CombatTracker.RenderContext["linked"]>().toEqualTypeOf<boolean | undefined>();

// Written by the tracker part, and only when an encounter is viewed.
expectTypeOf<CombatTracker.RenderContext["turns"]>().toEqualTypeOf<CombatTracker.TurnContext[] | undefined>();

// A number when the turn context is built, a fixed-precision string by the time the part renders.
expectTypeOf<CombatTracker.TurnContext["initiative"]>().toEqualTypeOf<number | string | null>();
expectTypeOf<CombatTracker.TurnContext["resource"]>().toEqualTypeOf<Combatant.Resource | null>();

// Deprecated since v13, until v15.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(tracker.initialize({ combat, render: false })).toBeVoid();
