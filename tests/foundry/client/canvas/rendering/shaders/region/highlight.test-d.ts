import { expectTypeOf } from "vitest";

import HighlightRegionShader = foundry.canvas.rendering.shaders.HighlightRegionShader;

const myHRS = HighlightRegionShader.create();
expectTypeOf(myHRS).toEqualTypeOf<HighlightRegionShader>();

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(myHRS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
