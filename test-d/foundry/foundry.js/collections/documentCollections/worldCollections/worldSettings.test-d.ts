import { expectType } from 'tsd';

const worldSettings = new WorldSettings();
expectType<Setting>(worldSettings.get('', { strict: true }));
expectType<Setting | undefined>(worldSettings.getSetting('foo'));
expectType<any[]>(worldSettings.toJSON());
expectType<null>(worldSettings.directory);
