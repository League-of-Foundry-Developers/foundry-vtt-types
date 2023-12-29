import { expectTypeOf } from "vitest";

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
