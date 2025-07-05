import { expectTypeOf } from "vitest";

import PrimaryCanvasContainer = foundry.canvas.primary.PrimaryCanvasContainer;

const myPCC = new PrimaryCanvasContainer();

expectTypeOf(myPCC.sort).toBeNumber();
myPCC.sort = 5; // Setter

expectTypeOf(myPCC.elevation).toBeNumber();
myPCC.elevation = 5; // Setter

expectTypeOf(myPCC.shouldRenderDepth).toBeBoolean();
expectTypeOf(myPCC.sortChildren()).toBeVoid();
expectTypeOf(myPCC.updateCanvasTransform()).toBeVoid();

declare const someRenderer: PIXI.Renderer;
expectTypeOf(myPCC.renderDepthData(someRenderer)).toBeVoid();
