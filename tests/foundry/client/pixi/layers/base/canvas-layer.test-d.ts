import { expectTypeOf } from "vitest";

class MyCanvasLayer extends CanvasLayer {
  async _draw() {}
}

const layer = new MyCanvasLayer();

expectTypeOf(layer.options).toEqualTypeOf(CanvasLayer.layerOptions);
