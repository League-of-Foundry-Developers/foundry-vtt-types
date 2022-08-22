import { expectType } from "tsd";

declare const combat: Combat;

expectType<ApplicationOptions>(CombatTracker.defaultOptions);

const tracker = new CombatTracker();
expectType<StoredDocument<Combat>[]>(tracker.combats);
expectType<CombatTracker>(tracker.createPopout());

expectType<void>(tracker.initialize());
tracker.initialize({ combat: null });
tracker.initialize({ combat: combat });
tracker.initialize({ render: true });
tracker.initialize({ render: false });

expectType<void>(tracker.scrollToTurn());
expectType<object>(await tracker.getData());
