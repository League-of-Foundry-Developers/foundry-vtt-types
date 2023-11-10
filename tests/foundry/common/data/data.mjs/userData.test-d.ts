import { expectTypeOf } from "vitest";

// @ts-expect-error a UserData requires data.
new foundry.data.UserData();

// @ts-expect-error a UserData requires a name.
new foundry.data.UserData({});

expectTypeOf(new foundry.data.UserData({ name: "foo" })).toEqualTypeOf<foundry.data.UserData>();
expectTypeOf(new foundry.data.UserData({ name: "foo", hotbar: { 1: "foo" } })).toEqualTypeOf<foundry.data.UserData>();
expectTypeOf(new foundry.data.UserData({ name: "foo", hotbar: { "1": "foo" } })).toEqualTypeOf<foundry.data.UserData>();
expectTypeOf(
  new foundry.data.UserData({ name: "foo", hotbar: { ["1"]: "foo" } }),
).toEqualTypeOf<foundry.data.UserData>();

// @ts-expect-error foo is not a number or a numeric string
new foundry.data.UserData({ name: "foo", hotbar: { foo: "foo" } });
