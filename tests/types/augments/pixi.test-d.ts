import { expectTypeOf, test } from "vitest";

test("types/augments/pixi UPDATE_PRIORITY", () => {
  // Foundry's custom ticker priorities, assigned in `Canvas##activateTicker`
  expectTypeOf(PIXI.UPDATE_PRIORITY.OBJECTS).toEqualTypeOf<23 & PIXI.UPDATE_PRIORITY>();
  expectTypeOf(PIXI.UPDATE_PRIORITY.INTERFACE).toEqualTypeOf<22 & PIXI.UPDATE_PRIORITY>();
  expectTypeOf(PIXI.UPDATE_PRIORITY.PRIMARY).toEqualTypeOf<3 & PIXI.UPDATE_PRIORITY>();
  expectTypeOf(PIXI.UPDATE_PRIORITY.PERCEPTION).toEqualTypeOf<2 & PIXI.UPDATE_PRIORITY>();
});
