import { expectTypeOf, test } from "vitest";

import VisibilityFilter = foundry.canvas.rendering.filters.VisibilityFilter;

declare const someFilterSystem: PIXI.FilterSystem;

test("foundry/client/canvas/rendering/filters/visibilty", () => {
  const myVF = VisibilityFilter.create();
  expectTypeOf(myVF).toEqualTypeOf<VisibilityFilter>();

  expectTypeOf(VisibilityFilter.create(undefined, { persistentVision: true })).toEqualTypeOf<VisibilityFilter>();
  expectTypeOf(VisibilityFilter["_createVertexShader"]()).toEqualTypeOf<string>();
  expectTypeOf(VisibilityFilter["_createFragmentShader"]({ persistentVision: true })).toEqualTypeOf<string>();

  expectTypeOf(myVF.calculateMatrix(someFilterSystem)).toEqualTypeOf<void>();
  expectTypeOf(myVF.blur).toEqualTypeOf<number | undefined>();
});
