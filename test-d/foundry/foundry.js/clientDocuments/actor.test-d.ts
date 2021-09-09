import { expectType } from 'tsd';

declare const document: boolean;

const actor = new Actor({ name: 'Beren', type: 'npc' });
expectType<Token[]>(actor.getActiveTokens());
expectType<Token[]>(actor.getActiveTokens(false, false));
expectType<TokenDocument[]>(actor.getActiveTokens(false, true));
expectType<Token[] | TokenDocument[]>(actor.getActiveTokens(false, document));
