import { expectError, expectType } from "tsd";
import "../../index";

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

expectError(
  clientSettings.register("foo", "bar", {
    scope: "world",
    type: String
  })
);
expectError(clientSettings.set("foo", "bar", "true"));

clientSettings.register("foo", "bar", {
  scope: "world",
  type: Boolean,
  config: true,
  default: true
});
clientSettings.set("foo", "bar", false);
expectType<boolean>(clientSettings.get("foo", "bar"));

expectType<unknown>(clientSettings.get("foo", "baz"));

// can only use range for number settings
expectError(
  clientSettings.register("some", "stringSetting", {
    scope: "world",
    type: String,
    range: {
      min: 0,
      max: 42,
      step: 1
    }
  })
);

clientSettings.register("some", "numberSetting", {
  scope: "world",
  type: Number,
  range: {
    min: 0,
    max: 42,
    step: 1
  }
});

// can only use filePicker for string settings
expectError(
  clientSettings.register("some", "numberSetting", {
    scope: "world",
    type: Number,
    filePicker: "audio"
  })
);

clientSettings.register("some", "stringSetting", {
  scope: "world",
  type: String,
  filePicker: "audio"
});

// core settings

expectType<{ resource: string; skipDefeated: boolean } | {}>(clientSettings.get("core", "combatTrackerConfig"));
expectType<Partial<Record<string, CompendiumCollection.Configuration>>>(
  clientSettings.get("core", "compendiumConfiguration")
);
expectType<keyof CONFIG.Dice.RollModes>(clientSettings.get("core", "rollMode"));
