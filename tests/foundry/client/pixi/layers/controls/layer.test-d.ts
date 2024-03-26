import { expectTypeOf } from "vitest";

const layer = new ControlsLayer();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof InteractionLayer>();
