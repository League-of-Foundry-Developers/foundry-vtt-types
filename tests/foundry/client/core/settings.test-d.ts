import { expectTypeOf } from "vitest";
import type { EmptyObject } from "../../../../src/types/utils.d.mts";

const clientSettings = new ClientSettings([]);

declare global {
  // eslint-disable-next-line
  namespace ClientSettings {
    interface Values {
      "foo.bar": boolean;
      "some.numberSetting": number;
      "some.stringSetting": string;
    }
  }
}

clientSettings.register("foo", "bar", {
  scope: "world",
  // @ts-expect-error - The setting foo.bar was declared as a boolean not a string
  type: String,
});

// @ts-expect-error - The setting foo.bar was declared as a boolean not a string
clientSettings.set("foo", "bar", "true");

clientSettings.register("foo", "bar", {
  scope: "world",
  type: Boolean,
  config: true,
  default: true,
});
clientSettings.set("foo", "bar", false);
expectTypeOf(clientSettings.get("foo", "bar")).toEqualTypeOf<boolean>();

expectTypeOf(clientSettings.get("foo", "baz")).toEqualTypeOf<unknown>();

clientSettings.register("some", "stringSetting", {
  scope: "world",
  type: String,
  // @ts-expect-error - Range shouldn't be valid for string settings
  range: {
    min: 0,
    max: 42,
    step: 1,
  },
});

clientSettings.register("some", "numberSetting", {
  scope: "world",
  type: Number,
  range: {
    min: 0,
    max: 42,
    step: 1,
  },
});

clientSettings.register("some", "numberSetting", {
  scope: "world",
  type: Number,
  // @ts-expect-error - Can only use filePicker for string settings
  filePicker: "audio",
});

clientSettings.register("some", "stringSetting", {
  scope: "world",
  type: String,
});

// core settings

expectTypeOf(clientSettings.get("core", "combatTrackerConfig")).toEqualTypeOf<
  { resource: string; skipDefeated: boolean } | EmptyObject
>();
expectTypeOf(clientSettings.get("core", "compendiumConfiguration")).toEqualTypeOf<
  Partial<Record<string, CompendiumCollection.Configuration>>
>();
expectTypeOf(clientSettings.get("core", "rollMode")).toEqualTypeOf<keyof CONFIG.Dice.RollModes>();
