import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

declare const combat: Combat;

expectTypeOf(CombatTracker.defaultOptions).toEqualTypeOf<ApplicationOptions>();

const tracker = new CombatTracker();
expectTypeOf(tracker.combats).toEqualTypeOf<Combat.Stored[]>();
expectTypeOf(tracker.createPopout()).toEqualTypeOf<CombatTracker>();

expectTypeOf(tracker.initialize()).toEqualTypeOf<void>();
tracker.initialize({ combat: null });
tracker.initialize({ combat: combat });
tracker.initialize({ render: true });
tracker.initialize({ render: false });

expectTypeOf(tracker.scrollToTurn()).toEqualTypeOf<void>();
expectTypeOf(await tracker.getData()).toEqualTypeOf<object>();
