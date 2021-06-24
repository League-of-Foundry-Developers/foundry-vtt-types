import { expectError, expectType } from 'tsd';

expectError(new foundry.data.CombatantData());
expectError(new foundry.data.CombatantData({}));
expectType<foundry.data.CombatantData>(new foundry.data.CombatantData({ tokenId: 'foo', actorId: 'bar' }));
