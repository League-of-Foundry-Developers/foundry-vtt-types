import { expectTypeOf } from "vitest";

class MyGroupClass extends BaseCanvasMixin(PIXI.Container) {}

const MyGroup = new MyGroupClass();

expectTypeOf(MyGroup.layers["grid"]).toEqualTypeOf<CanvasLayer>();
