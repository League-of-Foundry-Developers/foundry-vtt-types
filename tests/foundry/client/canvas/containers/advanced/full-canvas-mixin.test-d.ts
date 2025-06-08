import { expectTypeOf } from "vitest";
import { FullCanvasObjectMixin } from "#client/canvas/containers/_module.mjs";

class MyFullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}

const myFullCanvasContainer = new MyFullCanvasContainer();

expectTypeOf(myFullCanvasContainer.calculateBounds()).toEqualTypeOf<void>();
