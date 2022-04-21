import { expectType } from 'tsd';

const combatant = new Combatant({}, {});

// static properties of `BaseCombatant`
expectType<typeof foundry.data.CombatantData>(Combatant.schema);

// properties
expectType<string | null>(combatant.pack);
expectType<Combat | null>(combatant.parent);
expectType<Combat | null>(combatant.combat);
expectType<Actor | null>(combatant.actor);
expectType<TokenDocument | null>(combatant.token);
expectType<Record<string, Application>>(combatant.apps);

// static properties
expectType<Promise<StoredDocument<Combatant> | undefined>>(Combatant.create({ name: 'Some Combatant' }));
expectType<Promise<StoredDocument<Combatant>[]>>(Combatant.createDocuments([]));
expectType<Promise<Combatant[]>>(Combatant.updateDocuments([]));
expectType<Promise<Combatant[]>>(Combatant.deleteDocuments([]));
