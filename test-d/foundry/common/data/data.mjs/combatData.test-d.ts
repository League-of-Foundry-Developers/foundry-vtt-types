import { expectType } from 'tsd';

expectType<foundry.data.CombatData>(new foundry.data.CombatData());
expectType<foundry.data.CombatData>(new foundry.data.CombatData({}));
expectType<foundry.data.CombatData>(new foundry.data.CombatData({ scene: 'foo', active: true }));
