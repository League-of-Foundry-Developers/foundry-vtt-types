import { describe, expectTypeOf, test } from "vitest";

import VFXComponent = foundry.canvas.vfx.VFXComponent;
import VFXPath = foundry.canvas.vfx.VFXPath;

describe("CONFIG.Canvas.vfx", () => {
  test("shape", () => {
    expectTypeOf(CONFIG.Canvas.vfx.enabled).toEqualTypeOf<boolean>();
    expectTypeOf(CONFIG.Canvas.vfx.components).toEqualTypeOf<CONFIG.Canvas.VFX.Components>();
    expectTypeOf(CONFIG.Canvas.vfx.animations).toEqualTypeOf<CONFIG.Canvas.VFX.Animations>();
    expectTypeOf(CONFIG.Canvas.vfx.paths).toEqualTypeOf<CONFIG.Canvas.VFX.Paths>();
  });

  test("the entries registered by `configure()` are known keys", () => {
    expectTypeOf(CONFIG.Canvas.vfx.components.VFXSingleAttackComponent).toEqualTypeOf<
      typeof foundry.canvas.vfx.components.VFXSingleAttackComponent
    >();
    expectTypeOf(CONFIG.Canvas.vfx.animations.followPath).toEqualTypeOf<VFXComponent.Animation>();
    expectTypeOf(CONFIG.Canvas.vfx.paths.weave).toEqualTypeOf<VFXPath.Generator>();
  });

  test("named path lookups are keyed off the registry", () => {
    const points = [
      { x: 0, y: 0, elevation: 0 },
      { x: 100, y: 100, elevation: 0 },
    ] satisfies VFXPath.BasePathPoint[];

    expectTypeOf<VFXPath.ConfiguredPath>().toExtend<keyof CONFIG.Canvas.VFX.Paths>();
    expectTypeOf(VFXPath.getPathGenerator("linear")).toEqualTypeOf<VFXPath.Generator>();
    expectTypeOf(VFXPath.create("arc", points, {})).toEqualTypeOf<VFXPath>();
    expectTypeOf(foundry.canvas.vfx.utils.resolveAnimation("scale")).toEqualTypeOf<VFXComponent.Animation>();
  });
});
