import { expectTypeOf } from "vitest";

import FullCanvasObjectMixin = foundry.canvas.containers.FullCanvasObjectMixin;

class MyFullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}

const myFullCanvasContainer = new MyFullCanvasContainer();

expectTypeOf(myFullCanvasContainer.calculateBounds()).toEqualTypeOf<void>();
