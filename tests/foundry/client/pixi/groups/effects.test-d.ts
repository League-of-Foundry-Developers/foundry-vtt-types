import { expectTypeOf } from "vitest";

expectTypeOf(EffectsCanvasGroup.groupName).toEqualTypeOf<undefined>();

const myEffectGroup = new EffectsCanvasGroup();

expectTypeOf(myEffectGroup.animateDarkness(3, { duration: 40000 })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myEffectGroup.visibility).toMatchTypeOf<CanvasVisibility.Any>();
