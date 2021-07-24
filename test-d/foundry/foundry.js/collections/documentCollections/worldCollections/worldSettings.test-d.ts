import { expectType } from 'tsd';
import { SettingDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/settingData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const worldSettings = new WorldSettings();
expectType<Setting>(worldSettings.get('', { strict: true }));
expectType<Setting | undefined>(worldSettings.getSetting('foo'));
expectType<PropertiesToSource<SettingDataProperties>[]>(worldSettings.toJSON());
expectType<null>(worldSettings.directory);
