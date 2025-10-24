import { expectTypeOf, describe, test } from "vitest";

import ClientDatabaseBackend = foundry.data.ClientDatabaseBackend;

// just to avoid deprecation warnings
class MyItem<SubType extends Item.SubType> extends Item<SubType> {}

const itemCreateData = {
  type: "base",
  name: "foo",
} satisfies Item.CreateData;

declare const BaseItem: typeof MyItem<"base">;
declare const GearItem: typeof MyItem<"weapon" | "armor">;

describe("ClientDatabaseBackend Tests", () => {
  const cdb = new ClientDatabaseBackend();

  // NOTE: Support for `temporary` in the backend types has been preemptively removed due to type complications and it going away in v14
  test("Creation", async () => {
    expectTypeOf(await cdb.create(Item.implementation, { data: [itemCreateData] })).toEqualTypeOf<
      Item.Implementation[]
    >();

    // 'class'es with specific types baked in are allowed
    expectTypeOf(await cdb.create(BaseItem, { data: [itemCreateData] })).toEqualTypeOf<MyItem<"base">[]>();

    // this call is invalid at runtime, as `itemCreateData` has an invalid type for the 'class' passed
    expectTypeOf(await cdb.create(GearItem, { data: [itemCreateData] })).toEqualTypeOf<MyItem<"weapon" | "armor">[]>();
  });

  test("Miscellaneous", () => {
    expectTypeOf(cdb.activateSocketListeners(game.socket!)).toBeVoid();

    expectTypeOf(cdb.getFlagScopes()).toEqualTypeOf<ClientDatabaseBackend.FlagScopes[]>();
    expectTypeOf(cdb.getCompendiumScopes()).toEqualTypeOf<string[]>();
  });

  test("Logging", () => {
    expectTypeOf(cdb["_log"]("warn", "a message")).toBeVoid();
  });
});
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
