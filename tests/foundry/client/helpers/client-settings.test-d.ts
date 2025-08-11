import { expectTypeOf } from "vitest";
import type { MaybeEmpty } from "fvtt-types/utils";

import ClientSettings = foundry.helpers.ClientSettings;
import SettingsConfig = foundry.applications.settings.SettingsConfig;
import WorldSettings = foundry.documents.collections.WorldSettings;

const clientSettings = new ClientSettings([]);

expectTypeOf(clientSettings.settings).toEqualTypeOf<Map<keyof SettingConfig & string, ClientSettings.SettingConfig>>();
expectTypeOf(clientSettings.menus).toEqualTypeOf<Map<string, ClientSettings.SettingSubmenuConfig>>();
expectTypeOf(clientSettings.storage).toEqualTypeOf<Map<string, Storage | WorldSettings>>();
expectTypeOf(clientSettings.sheet).toEqualTypeOf<SettingsConfig>();

declare const subMenu: ClientSettings.RegisterSubmenu;
expectTypeOf(clientSettings.registerMenu("foo", "bar", subMenu)).toEqualTypeOf<void>();

// specify the settings we will use
declare global {
  interface SettingConfig {
    "foo.bar": boolean;
    "some.numberSetting": number;
    "some.stringSetting": string;

    "data-model.setting": Actor.ImplementationClass;
  }
}

clientSettings.register("foo", "bar", {
  scope: "world",
  // @ts-expect-error The setting foo.bar was declared as a boolean not a string
  type: String,
});

// @ts-expect-error The setting foo.bar was declared as a boolean not a string
clientSettings.set("foo", "bar", "true");

clientSettings.register("foo", "bar", {
  scope: "world",
  type: Boolean,
  config: true,
  default: true,
});
clientSettings.set("foo", "bar", false);
expectTypeOf(clientSettings.get("foo", "bar")).toEqualTypeOf<boolean>();
expectTypeOf(clientSettings.get("foo", "bar", { document: true })).toEqualTypeOf<Setting.Implementation>();

// @ts-expect-error Expect an error because the setting wasn't registered.
clientSettings.get("foo", "baz");

clientSettings.register("some", "stringSetting", {
  scope: "world",
  type: String,
  // @ts-expect-error Range shouldn't be valid for string settings
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
  // @ts-expect-error filePicker isnot a valid config setting
  filePicker: "audio",
});

clientSettings.register("data-model", "setting", {
  scope: "client",
  type: Actor,
});

expectTypeOf(clientSettings.set("data-model", "setting", { type: "base", name: "Test Actor" })).toEqualTypeOf<
  Promise<Actor.Implementation>
>();
expectTypeOf(clientSettings.get("data-model", "setting")).toEqualTypeOf<Actor.Implementation>();

clientSettings.register("data-model", "setting", {
  scope: "client",
  type: Actor,
});

expectTypeOf(clientSettings.set("data-model", "setting", { type: "base", name: "Test Actor" })).toEqualTypeOf<
  Promise<Actor.Implementation>
>();
expectTypeOf(clientSettings.get("data-model", "setting")).toEqualTypeOf<Actor.Implementation>();

// core settings

expectTypeOf(clientSettings.get("core", "combatTrackerConfig")).toEqualTypeOf<
  MaybeEmpty<{ resource: string; skipDefeated: boolean }>
>();
expectTypeOf(clientSettings.get("core", "compendiumConfiguration")).toEqualTypeOf<
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  foundry.data.fields.DataField.AssignmentTypeFor<foundry.documents.collections.CompendiumCollection.ConfigSetting.Field>
>();

expectTypeOf(clientSettings.get("core", "rollMode")).toEqualTypeOf<foundry.dice.Roll.Mode | null>();
