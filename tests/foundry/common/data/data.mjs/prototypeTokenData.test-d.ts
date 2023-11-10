import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.data.PrototypeTokenData()).toEqualTypeOf<foundry.data.PrototypeTokenData>();
expectTypeOf(new foundry.data.PrototypeTokenData({})).toEqualTypeOf<foundry.data.PrototypeTokenData>();
expectTypeOf(new foundry.data.PrototypeTokenData({ name: "foo" })).toEqualTypeOf<foundry.data.PrototypeTokenData>();
expectTypeOf(new foundry.data.PrototypeTokenData({ name: "foo" }).actorLink).toEqualTypeOf<boolean>();
expectTypeOf(new foundry.data.PrototypeTokenData({ name: "foo" }).bar1.attribute).toEqualTypeOf<string | null>();
