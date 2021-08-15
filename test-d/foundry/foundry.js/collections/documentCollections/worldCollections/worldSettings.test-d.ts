import type { SettingDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/settingData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const worldSettings = new WorldSettings();
expectType<Setting>(worldSettings.get('', { strict: true }));
expectType<Setting | undefined>(worldSettings.getSetting('foo'));
expectType<PropertiesToSource<SettingDataProperties>[]>(worldSettings.toJSON());
expectType<null>(worldSettings.directory);
