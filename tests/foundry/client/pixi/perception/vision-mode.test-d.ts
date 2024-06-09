import { expectTypeOf } from "vitest";

class MyVisionMode extends VisionMode {
  _activate(source: VisionSource): void {
    source.animate(5000);
  }

  _deactivate(source: VisionSource): void {
    source.animation;
  }
}

const monochromatic = new MyVisionMode({
  id: "monochromatic",
  label: "VISION.ModeMonochromatic",
  canvas: {
    shader: ColorAdjustmentsSamplerShader,
    uniforms: { contrast: 0, saturation: -1.0, brightness: 0 },
  },
  lighting: {
    background: {
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
  },
  vision: {
    darkness: { adaptive: false },
    defaults: { attenuation: 0, contrast: 0, saturation: -1, brightness: 0 },
  },
});

declare const ShaderAssType: ShaderField.AssignmentType<ShaderField.DefaultOptions>;
expectTypeOf(ShaderAssType).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

declare const ShaderInitType: ShaderField.InitializedType<ShaderField.DefaultOptions>;
expectTypeOf(ShaderInitType).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

const myVisionSource = new VisionSource();

// Next line could possibly be a `never` instead, but not sure the generic usage is worth the headache
expectTypeOf(monochromatic.schema.fields.canvas.fields.shader._cast("foo")).toEqualTypeOf<typeof AbstractBaseShader>;
expectTypeOf(monochromatic.activate(myVisionSource)).toEqualTypeOf<void>();
expectTypeOf(monochromatic.id).toEqualTypeOf<string | undefined>();
expectTypeOf(monochromatic.canvas.shader).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>();
