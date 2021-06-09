import { expectType } from 'tsd';

const token = new Token();
expectType<string>(token.id);
expectType<Actor | null>(token.actor);
expectType<string>(token.data.actorId);
expectType<boolean>(token.data.actorLink);
expectType<number>(token.data.x);
expectType<number>(token.data.y);
expectType<boolean>(token.data.hidden);
expectType<boolean>(token.emitsLight);
expectType<Promise<TokenDocument[]>>(token.toggleVisibility());
expectType<Promise<boolean>>(token.toggleEffect(CONFIG.statusEffects[0]));
expectType<Promise<boolean>>(token.toggleEffect('path/to/my/image.png'));
