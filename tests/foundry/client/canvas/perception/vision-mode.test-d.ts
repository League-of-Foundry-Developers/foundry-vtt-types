import { describe, expectTypeOf, test } from "vitest";

import VisionMode = foundry.canvas.perception.VisionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import ColorAdjustmentsSamplerShader = foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader;
import FlameColorationShader = foundry.canvas.rendering.shaders.FlameColorationShader;
import ShaderField = foundry.data.fields.ShaderField;

declare const assignmentShaderField: ShaderField.AssignmentType<ShaderField.DefaultOptions>;
declare const initializedShaderField: ShaderField.InitializedType<ShaderField.DefaultOptions>;
declare const visionSource: PointVisionSource.Initialized;

describe("VisionMode tests", () => {
  const monochromaticSource = {
    id: "monochromatic",
    label: "VISION.ModeMonochromatic",
    tokenConfig: false,
    canvas: {
      shader: ColorAdjustmentsSamplerShader,
      uniforms: { contrast: 0, saturation: -1.0, brightness: 0 },
    },
    lighting: {
      background: {
        visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED,
        postProcessingModes: ["SATURATION"],
        uniforms: { saturation: -1.0, tint: [1, 1, 1] },
      },
      illumination: {
        postProcessingModes: ["SATURATION"],
        uniforms: { saturation: -1.0, tint: [1, 1, 1] },
      },
      coloration: {
        postProcessingModes: ["SATURATION"],
        uniforms: { saturation: -1.0, tint: [1, 1, 1] },
      },
      levels: {
        [VisionMode.LIGHTING_LEVELS.BRIGHT]: VisionMode.LIGHTING_LEVELS.HALFDARK,
      },
    },
    vision: {
      coloration: {
        shader: FlameColorationShader,
        uniforms: { saturation: -1.0, tint: [1, 1, 1] },
      },
      illumination: {
        shader: null,
        uniforms: { saturation: -1.0, tint: [1, 1, 1] },
      },
      background: { shader: undefined, uniforms: { saturation: -1.0, tint: [1, 1, 1] } },
      darkness: { adaptive: false },
      defaults: { color: "#FFABAB", attenuation: 0, contrast: 0, saturation: -1, brightness: 0 },
      preferred: false,
    },
  } satisfies VisionMode.CreateData;

  test("Construction", () => {
    new VisionMode();
    new VisionMode(monochromaticSource);
  });

  const monochromatic = new VisionMode(monochromaticSource);

  test("Brands", () => {
    expectTypeOf(VisionMode.LIGHTING_VISIBILITY).toExtend<
      Record<keyof VisionMode.LightingVisibility, VisionMode.LIGHTING_VISIBILITY>
    >();
    expectTypeOf(VisionMode.LIGHTING_LEVELS).toEqualTypeOf<typeof foundry.CONST.LIGHTING_LEVELS>();
  });

  test("Miscellaneous", () => {
    expectTypeOf(monochromatic.perceivesLight).toBeBoolean();

    expectTypeOf(monochromatic.activate(visionSource)).toBeVoid();
    expectTypeOf(monochromatic["_activate"](visionSource)).toBeVoid();
    expectTypeOf(monochromatic.deactivate(visionSource)).toBeVoid();
    expectTypeOf(monochromatic["_deactivate"](visionSource)).toBeVoid();
  });

  test("Animation", () => {
    expectTypeOf(monochromatic.animated).toBeBoolean();
    expectTypeOf(monochromatic.animate.call(visionSource, 0.6)).toBeVoid();

    // `this` must be the vision source; the VisionMode has no `animation` state of its own.
    // @ts-expect-error Called on the VisionMode itself, `this` is not a vision source.
    monochromatic.animate(0.6);
  });

  test("Schema properties", () => {
    expectTypeOf(monochromatic.id).toEqualTypeOf<string | undefined>();
    expectTypeOf(monochromatic.canvas.shader).toEqualTypeOf<typeof AbstractBaseShader | null | undefined>();
  });

  test("ShaderField", () => {
    expectTypeOf(assignmentShaderField).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;
    expectTypeOf(initializedShaderField).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

    expectTypeOf(monochromatic.schema.fields.canvas.fields.shader._cast(AbstractBaseShader)).toEqualTypeOf<
      typeof AbstractBaseShader | null | undefined
    >();
    // would throw at runtime, but _cast accepts `unknown`
    expectTypeOf(monochromatic.schema.fields.canvas.fields.shader._cast("foo")).toEqualTypeOf<
      typeof AbstractBaseShader | null | undefined
    >();
  });
});
