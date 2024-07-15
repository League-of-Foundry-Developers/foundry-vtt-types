import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.BaseEffectSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
