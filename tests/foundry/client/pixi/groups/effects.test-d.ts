import { expectTypeOf } from "vitest";

const myEffectGroup = new EffectsCanvasGroup();

expectTypeOf(myEffectGroup.animateDarkness(3, { duration: 40000 })).toEqualTypeOf<Promise<boolean | void>>();
