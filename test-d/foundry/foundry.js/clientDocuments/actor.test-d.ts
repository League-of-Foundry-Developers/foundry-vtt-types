import { expectAssignable, expectType } from 'tsd';

declare const document: boolean;

const actor = new Actor({ name: 'Beren', type: 'npc' });
expectType<Token[]>(actor.getActiveTokens());
expectType<Token[]>(actor.getActiveTokens(false, false));
expectType<TokenDocument[]>(actor.getActiveTokens(false, true));
expectType<Token[] | TokenDocument[]>(actor.getActiveTokens(false, document));

expectAssignable<foundry.data.ItemData>(actor.itemTypes['armor'][0].data);

interface CharacterActor {
  data: foundry.data.ActorData & { type: 'character'; _source: { type: 'character' } };
}
class CharacterActor extends Actor {
  someCustomFunction() {
    expectType<'character'>(this.data.type);
    expectType<number>(this.data.data.movement);
    expectType<'character'>(this.data._source.type);
    expectType<number>(this.data._source.data.health);
  }
}

declare const character: CharacterActor;

expectType<'character'>(character.data.type);
expectType<number>(character.data.data.movement);
expectType<'character'>(character.data._source.type);
expectType<number>(character.data._source.data.health);

expectType<'character'>(character.toObject().type);
expectType<number>(character.toObject().data.health);
