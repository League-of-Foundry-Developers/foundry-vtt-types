import { expectTypeOf } from "vitest";

const avSettings = new AVSettings();

expectTypeOf(avSettings.client).toEqualTypeOf<AVSettings.ClientSettings>();
expectTypeOf(avSettings.world).toEqualTypeOf<AVSettings.WorldSettings>();
expectTypeOf(avSettings.activity).toEqualTypeOf<Record<string, AVSettingsData>>();
expectTypeOf(avSettings.getUser("")).toEqualTypeOf<AVSettings.UserSettings | null>();
expectTypeOf(avSettings.users).toEqualTypeOf<Record<string, AVSettings.UserSettings>>();
expectTypeOf(avSettings.verticalDock).toEqualTypeOf<boolean>();

interface CustomVoiceModes {
  SOME_CUSTOM_MODE: "custom";
}

declare global {
  namespace AVSettings {
    interface Overrides {
      VoiceModes: CustomVoiceModes;
    }
  }
}

AVSettings.VOICE_MODES = {
  SOME_CUSTOM_MODE: "custom",
};

expectTypeOf(AVSettings.VOICE_MODES).toEqualTypeOf<CustomVoiceModes>();

const avMaster = new AVMaster();
expectTypeOf(avMaster.settings.client.voice.mode).toEqualTypeOf<"custom">();
