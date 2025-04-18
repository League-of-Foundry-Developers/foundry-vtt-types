import { expectTypeOf } from "vitest";

const myBackend = new foundry.data.ClientDatabaseBackend();

expectTypeOf(myBackend.create(Item, { data: [{ name: "foo" }], broadcast: true, pack: null })).toEqualTypeOf<
  Promise<Item[]>
>();

expectTypeOf(myBackend.update(Actor, { updates: [{ name: "foo" }], broadcast: false, pack: null })).toEqualTypeOf<
  Promise<Actor.Implementation[]>
>();

expectTypeOf(myBackend.delete(Scene, { ids: [], broadcast: true, pack: "some.pack" })).toEqualTypeOf<
  Promise<Scene[]>
>();
