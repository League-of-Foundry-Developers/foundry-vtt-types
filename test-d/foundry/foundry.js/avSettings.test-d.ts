import { expectType } from 'tsd';

interface CustomVoiceModes {
  SOME_CUSTOM_MODE: 'custom';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace AVSettings {
    interface Overrides {
      VoiceModes: CustomVoiceModes;
    }
  }
}

AVSettings.VOICE_MODES = {
  SOME_CUSTOM_MODE: 'custom'
};

expectType<CustomVoiceModes>(AVSettings.VOICE_MODES);

const avMaster = new AVMaster();
expectType<'custom'>(avMaster.settings.client.voice.mode);
