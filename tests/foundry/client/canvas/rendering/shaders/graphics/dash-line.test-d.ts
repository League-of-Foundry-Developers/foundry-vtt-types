import { expectTypeOf } from "vitest";
import { DashLineShader } from "#client/canvas/rendering/shaders/_module.mjs";

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
