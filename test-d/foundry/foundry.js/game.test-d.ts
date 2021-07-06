import { expectType } from 'tsd';

declare const aGame: Game;

expectType<CombatEncounters | undefined>(aGame.combats);
expectType<Localization>(aGame.i18n);
expectType<ClientSettings>(aGame.settings);
