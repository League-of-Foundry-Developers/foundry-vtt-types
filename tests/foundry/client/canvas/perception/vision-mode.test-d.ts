import { expectTypeOf } from "vitest";
// eslint-disable-next-line import-x/no-named-default
import { default as VisionMode, ShaderField } from "#client/canvas/perception/vision-mode.mjs";

expectTypeOf(VisionMode.LIGHTING_VISIBILITY).toExtend<
  Record<keyof VisionMode.LightingVisibility, VisionMode.LIGHTING_VISIBILITY>
>();
expectTypeOf(VisionMode.LIGHTING_LEVELS).toEqualTypeOf<typeof foundry.CONST.LIGHTING_LEVELS>();

const monochromatic = new VisionMode({
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
});

declare const ShaderAssType: ShaderField.AssignmentType<ShaderField.DefaultOptions>;
expectTypeOf(ShaderAssType).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

declare const ShaderInitType: ShaderField.InitializedType<ShaderField.DefaultOptions>;
expectTypeOf(ShaderInitType).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

declare const myVisionSource: foundry.canvas.sources.PointVisionSource.Any;

// Next line could possibly be a `never` instead, but not sure the generic usage is worth the headache
expectTypeOf(monochromatic.schema.fields.canvas.fields.shader._cast("foo")).toEqualTypeOf<typeof AbstractBaseShader>;
expectTypeOf(monochromatic.activate(myVisionSource)).toEqualTypeOf<void>();
expectTypeOf(monochromatic.id).toEqualTypeOf<string | undefined>();
expectTypeOf(monochromatic.canvas.shader).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>();
expectTypeOf(monochromatic.animated).toBeBoolean();
expectTypeOf(monochromatic.animate(0.6)).toEqualTypeOf<void>();
expectTypeOf(monochromatic.perceivesLight).toBeBoolean();
