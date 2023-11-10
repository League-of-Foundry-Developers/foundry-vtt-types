import { expectTypeOf } from "vitest";

// @ts-expect-error A SettingData requires data.
new foundry.data.SettingData();

// @ts-expect-error A SettingData requires a key and value.
new foundry.data.SettingData({});

// @ts-expect-error Key must contain a period.
new foundry.data.SettingData({ key: "foo", value: "bar" });

expectTypeOf(new foundry.data.SettingData({ key: "foo.bar", value: "bar" })).toEqualTypeOf<foundry.data.SettingData>();

const namespace = "foo";
const key = "bar";

expectTypeOf(
  new foundry.data.SettingData({ key: `${namespace}.${key}`, value: "bar" }),
).toEqualTypeOf<foundry.data.SettingData>();

// @ts-expect-error This key contains a period but Typescript doesn't infer that and so it should error.
new foundry.data.SettingData({ key: namespace + "." + key, value: "bar" });
