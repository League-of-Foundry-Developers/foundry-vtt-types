import { describe, expectTypeOf, test } from "vitest";

import VFXComponent = foundry.canvas.vfx.VFXComponent;
import VFXPath = foundry.canvas.vfx.VFXPath;

describe("CONFIG.Canvas.vfx", () => {
  test("shape", () => {
    expectTypeOf(CONFIG.Canvas.vfx.enabled).toEqualTypeOf<boolean>();
    expectTypeOf(CONFIG.Canvas.vfx.components).toEqualTypeOf<Record<string, typeof VFXComponent>>();
    expectTypeOf(CONFIG.Canvas.vfx.animations).toEqualTypeOf<Record<string, VFXComponent.Animation>>();
    expectTypeOf(CONFIG.Canvas.vfx.paths).toEqualTypeOf<Record<string, VFXPath.Generator>>();
  });
});
