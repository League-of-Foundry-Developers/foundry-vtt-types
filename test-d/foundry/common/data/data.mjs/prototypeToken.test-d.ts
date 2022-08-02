import { expectType } from 'tsd';

expectType<foundry.data.PrototypeToken>(new foundry.data.PrototypeToken());
expectType<foundry.data.PrototypeToken>(new foundry.data.PrototypeToken({}));
expectType<foundry.data.PrototypeToken>(new foundry.data.PrototypeToken({ name: 'foo' }));
expectType<boolean>(new foundry.data.PrototypeToken({ name: 'foo' }).actorLink);
expectType<string | null>(new foundry.data.PrototypeToken({ name: 'foo' }).bar1.attribute);
