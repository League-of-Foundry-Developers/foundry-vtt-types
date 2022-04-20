import { expectType } from 'tsd';

const worldSettings = new WorldSettings();
expectType<StoredDocument<Setting>>(worldSettings.get('', { strict: true }));
expectType<StoredDocument<Setting> | undefined>(worldSettings.getSetting('foo'));
expectType<StoredDocument<Setting>['data']['_source'][]>(worldSettings.toJSON());
expectType<undefined>(worldSettings.directory);
