import { expectTypeOf } from "vitest";
import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes.mts";

const token = new Token(new TokenDocument());
expectTypeOf(token.id).toEqualTypeOf<string>();
expectTypeOf(token.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(token.data.actorId).toEqualTypeOf<string | null>();
expectTypeOf(token.data.actorLink).toEqualTypeOf<boolean>();
expectTypeOf(token.data.x).toEqualTypeOf<number>();
expectTypeOf(token.data.y).toEqualTypeOf<number>();
expectTypeOf(token.data.hidden).toEqualTypeOf<boolean>();
expectTypeOf(token.emitsLight).toEqualTypeOf<boolean>();
expectTypeOf(token.toggleVisibility()).toEqualTypeOf<
  Promise<InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[]>
>();
expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0])).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(token.toggleEffect(new ActiveEffect().data)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(token.toggleEffect("path/to/my/image.png")).toEqualTypeOf<Promise<boolean>>();
