import { expectType } from 'tsd';

new Localization();
const localization = new Localization('en.core');
expectType<string>(localization.lang);
expectType<string>(localization.defaultModule);
expectType<Record<string, string | Record<string, string | Record<string, string | Record<string, unknown>>>>>(
  localization.translations
);
expectType<Promise<void>>(localization.initialize());
expectType<Promise<void>>(localization.setLanguage('de'));
expectType<boolean>(localization.has('WORLD.DetailTab'));
expectType<boolean>(localization.has('WORLD.DetailTab', true));
expectType<string>(localization.localize('WORLD.DetailTab'));
expectType<string>(localization.format('DICE.ErrorNonNumeric'));
expectType<string>(localization.format('DICE.ErrorNonNumeric', { formula: '2d10' }));
