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

declare const ShaderType: ShaderField.AssignmentType<ShaderField.DefaultOptions>;
expectTypeOf(ShaderType).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>;

const myVisionSource = new VisionSource();

expectTypeOf(monochromatic.activate(myVisionSource)).toEqualTypeOf<void>();
expectTypeOf(monochromatic.id).toEqualTypeOf<string | undefined>();
expectTypeOf(monochromatic.canvas.shader).toEqualTypeOf<typeof AbstractBaseShader | undefined | null>();
