import { expectTypeOf, test } from "vitest";

import DashLineShader = foundry.canvas.rendering.shaders.DashLineShader;

test("foundry/client/canvas/rendering/shaders/graphics/dash-line", () => {
  new DashLineShader();
  new DashLineShader({});
  new DashLineShader({
    dash: undefined,
    gap: undefined,
    offset: undefined,
  });
  const myDLS = new DashLineShader({
    dash: 17.3,
    gap: 8.7,
    offset: 1.2,
  });

  expectTypeOf(myDLS).toEqualTypeOf<DashLineShader>();
});
