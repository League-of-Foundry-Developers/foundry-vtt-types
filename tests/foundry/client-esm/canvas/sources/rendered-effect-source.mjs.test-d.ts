import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.RenderedEffectSource();
const meshes = mySource.drawMeshes();
expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(meshes.background?.visible).toEqualTypeOf<boolean | undefined>();
