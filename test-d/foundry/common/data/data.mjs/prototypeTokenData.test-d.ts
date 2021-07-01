import { expectType } from 'tsd';

expectType<foundry.data.PrototypeTokenData>(new foundry.data.PrototypeTokenData());
expectType<foundry.data.PrototypeTokenData>(new foundry.data.PrototypeTokenData({}));
expectType<foundry.data.PrototypeTokenData>(new foundry.data.PrototypeTokenData({ name: 'foo' }));
expectType<boolean>(new foundry.data.PrototypeTokenData({ name: 'foo' }).actorLink);
expectType<string | null>(new foundry.data.PrototypeTokenData({ name: 'foo' }).bar1.attribute);
