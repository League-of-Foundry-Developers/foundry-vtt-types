import { expectTypeOf } from "vitest";

expectTypeOf(InteractionLayer.layerOptions.baseClass).toEqualTypeOf<typeof InteractionLayer>;
