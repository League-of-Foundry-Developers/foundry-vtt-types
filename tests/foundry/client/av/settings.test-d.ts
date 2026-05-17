import { expectTypeOf } from "vitest";

import AVMaster = foundry.av.AVMaster;
import AVSettings = foundry.av.AVSettings;

const avSettings = new AVSettings();

AVSettings.DEFAULT_USER_SETTINGS.blocked;

expectTypeOf(avSettings.client).toEqualTypeOf<AVSettings.ClientSettingData>();
expectTypeOf(avSettings.world).toEqualTypeOf<AVSettings.WorldSettingData>();
expectTypeOf(avSettings.activity).toEqualTypeOf<Record<string, AVSettings.Data>>();
expectTypeOf(avSettings.getUser("")).toEqualTypeOf<AVSettings.UserSettings | null>();
expectTypeOf(avSettings.users).toEqualTypeOf<Record<string, AVSettings.UserSettings>>();
expectTypeOf(avSettings.verticalDock).toEqualTypeOf<boolean>();

const avMaster = new AVMaster();
expectTypeOf(avMaster.settings.client.voice.mode).toEqualTypeOf<AVSettings.VOICE_MODES>();
