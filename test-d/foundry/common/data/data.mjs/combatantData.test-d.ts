import { expectType } from 'tsd';

expectType<foundry.data.CombatantData>(new foundry.data.CombatantData());
expectType<foundry.data.CombatantData>(new foundry.data.CombatantData({}));
expectType<foundry.data.CombatantData>(new foundry.data.CombatantData({ tokenId: 'foo', actorId: 'bar' }));
