import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.PointSoundSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(
  mySource.initialize({ radius: 5, walls: true, disabled: false }),
).toEqualTypeOf<foundry.canvas.sources.PointSoundSource>();
