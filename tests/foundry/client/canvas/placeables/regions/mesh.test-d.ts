import { describe, expectTypeOf, test } from "vitest";

import RegionMesh = foundry.canvas.placeables.regions.RegionMesh;
import Region = foundry.canvas.placeables.Region;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import PulseColorationShader = foundry.canvas.rendering.shaders.PulseColorationShader;
import RegionShader = foundry.canvas.rendering.shaders.RegionShader;

declare const region: Region.Implementation;
declare const renderer: PIXI.Renderer;

describe("RegionMesh Tests", () => {
  test("Construction", () => {
    // @ts-expect-error must supply a Region
    new RegionMesh();
    expectTypeOf(new RegionMesh(region)).toEqualTypeOf<RegionMesh>();
    expectTypeOf(new RegionMesh(region, PulseColorationShader)).toEqualTypeOf<RegionMesh>();
  });

  const mesh = new RegionMesh(region, RegionShader);

  test("Properties and getters", () => {
    expectTypeOf(mesh.region).toEqualTypeOf<Region.Implementation>();
    expectTypeOf(mesh.shader).toEqualTypeOf<AbstractBaseShader.Any>();

    expectTypeOf(mesh.blendMode).toExtend<PIXI.BLEND_MODES>();
    expectTypeOf((mesh.blendMode = PIXI.BLEND_MODES.DST_ATOP)).toExtend<PIXI.BLEND_MODES>();

    expectTypeOf(mesh.tint).toBeNumber();
    mesh.tint = 0xabcedf; // Setter

    expectTypeOf(mesh["_tintColor"]).toEqualTypeOf<PIXI.Color>();
    expectTypeOf(mesh["_cachedTint"]).toEqualTypeOf<Color.RGBAColorVector>();
    expectTypeOf(mesh["_tintAlphaDirty"]).toBeBoolean();
  });

  test("Methods", () => {
    expectTypeOf(mesh.setShaderClass(PulseColorationShader)).toBeVoid();
    expectTypeOf(mesh.updateTransform()).toBeVoid();

    expectTypeOf(mesh["_render"](renderer)).toBeVoid();
    expectTypeOf(mesh["_calculateBounds"]()).toBeVoid();

    expectTypeOf(mesh.containsPoint({ x: 50, y: 50 })).toBeBoolean();
  });
});
