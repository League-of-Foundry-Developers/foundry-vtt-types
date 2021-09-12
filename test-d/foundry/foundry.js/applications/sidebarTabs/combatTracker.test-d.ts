import { expectType } from 'tsd';
import { ConfiguredDocumentClass } from '../../../../../src/types/helperTypes';

declare const combat: Combat;

expectType<CombatTracker.Options>(CombatTracker.defaultOptions);

const tracker = new CombatTracker();
expectType<StoredDocument<Combat>[]>(tracker.combats);
expectType<CombatTracker>(tracker.createPopout());

expectType<void>(tracker.initialize());
tracker.initialize({ combat: null });
tracker.initialize({ combat: combat });
tracker.initialize({ render: true });
tracker.initialize({ render: false });

expectType<void>(tracker.scrollToTurn());
expectType<
  | {
      user: StoredDocument<User> | null;
      combats: StoredDocument<Combat>[];
      combatCount: number;
      started: boolean;
      settings: { resource: string; skipDefeated: boolean };
      currentIndex: -1;
      hasCombat: false;
      combat: null;
      turns: [];
      previousId: null;
      nextId: null;
      control: false;
    }
  | {
      user: StoredDocument<User> | null;
      combats: StoredDocument<Combat>[];
      combatCount: number;
      started: boolean;
      settings: { resource: string; skipDefeated: boolean };
      currentIndex: number;
      hasCombat: true;
      combat: StoredDocument<Combat>;
      turns: Array<{
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
      }>;
      previousId: string | null;
      nextId: string | null;
      control: boolean;
      round: number;
      turn: number;
    }
>(await tracker.getData());
