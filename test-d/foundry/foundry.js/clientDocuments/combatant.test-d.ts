import { expectError, expectType } from 'tsd';

const combatant = new Combatant({}, {});

// static properties of `BaseCombatant`
expectType<typeof foundry.data.CombatantData>(Combatant.schema);

// properties
expectType<string | null>(combatant.pack);
//expectType<BaseCombat | null>(combatant.parent); //TODO change to Combat once it is typed
expectType<Actor | null>(combatant.actor);
expectType<TokenDocument | null>(combatant.token);
expectType<Record<string, Application>>(combatant.apps);

// static properties
expectType<Promise<Combatant | undefined>>(Combatant.create({ name: 'Some Combatant' }));
expectType<Promise<Combatant[]>>(Combatant.createDocuments([]));
expectType<Promise<Combatant[]>>(Combatant.updateDocuments([]));
expectType<Promise<Combatant[]>>(Combatant.deleteDocuments([]));

declare global {
  interface CombatantFlags {
    'my-system': {
      value: boolean;
      value2: number;
    };
  }
}

expectType<{ value: boolean; value2: number }>(combatant.data.flags['my-system']);

expectType<boolean>(combatant.getFlag('my-system', 'value'));
expectType<number>(combatant.getFlag('my-system', 'value2'));
expectType<never>(combatant.getFlag('my-system', 'unknown-key'));
expectType<unknown>(combatant.getFlag('another-system', 'value'));

expectType<Promise<Combatant>>(combatant.setFlag('my-system', 'value', true));
expectError(combatant.setFlag('my-system', 'value', 2));
expectError(combatant.setFlag('my-system', 'unknown-key', 2));
expectType<Promise<Combatant>>(combatant.setFlag('another-system', 'value', true));
