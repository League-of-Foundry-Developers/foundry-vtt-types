import { expectTypeOf } from "vitest";

const myBackend = new foundry.data.ClientDatabaseBackend();

expectTypeOf(
  myBackend.create(Item.implementation, { data: [{ type: "base", name: "foo" }], broadcast: true, pack: null }),
).toEqualTypeOf<Promise<Item.Implementation[]>>();

expectTypeOf(
  myBackend.update(Actor.implementation, { updates: [{ name: "foo" }], broadcast: false, pack: null }),
).toEqualTypeOf<Promise<Actor.Implementation[]>>();

expectTypeOf(myBackend.delete(Scene.implementation, { ids: [], broadcast: true, pack: "some.pack" })).toEqualTypeOf<
  Promise<Scene.Implementation[]>
>();
