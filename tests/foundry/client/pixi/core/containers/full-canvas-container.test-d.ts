import { expectTypeOf } from "vitest";

class MyFullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}

const myFullCanvasContainer = new MyFullCanvasContainer();

expectTypeOf(myFullCanvasContainer.calculateBounds()).toEqualTypeOf<void>();
