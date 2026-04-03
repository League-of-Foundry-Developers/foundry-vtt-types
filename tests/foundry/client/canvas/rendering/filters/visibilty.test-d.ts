import { expectTypeOf } from "vitest";

import VisibilityFilter = foundry.canvas.rendering.filters.VisibilityFilter;

const myVF = VisibilityFilter.create();
expectTypeOf(myVF).toEqualTypeOf<VisibilityFilter>();

declare const someFilterSystem: PIXI.FilterSystem;

expectTypeOf(VisibilityFilter.fragmentShader({ persistentVision: true })).toEqualTypeOf<string>();
expectTypeOf(VisibilityFilter.vertexShader).toEqualTypeOf<string>();

expectTypeOf(myVF.calculateMatrix(someFilterSystem)).toEqualTypeOf<void>();
expectTypeOf(myVF.blur).toEqualTypeOf<number>();
