import { expectTypeOf } from "vitest";

expectTypeOf(BatchRenderer.shaderGeneratorClass).toMatchTypeOf<typeof BatchShaderGenerator>();
expectTypeOf(BatchRenderer.hasPlugin("bob")).toEqualTypeOf<boolean>;

declare const someRenderer: PIXI.Renderer;
const myBR = new BatchRenderer(someRenderer);

expectTypeOf(myBR.reservedTextureUnits).toEqualTypeOf<BatchRenderer.ReservedTextureUnits>();
expectTypeOf(myBR.start()).toEqualTypeOf<void>();
