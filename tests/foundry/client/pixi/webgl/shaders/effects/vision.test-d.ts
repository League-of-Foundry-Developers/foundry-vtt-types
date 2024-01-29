import { expectTypeOf } from "vitest";

class myVisionShader extends AmplificationBackgroundVisionShader {
  static COLOR_TINT = [0.25, 0.41, 0.88];

  static override defaultUniforms = {
    ...super.defaultUniforms,
    colorTint: this.COLOR_TINT,
  };
}

expectTypeOf(myVisionShader.create()).toEqualTypeOf<myVisionShader>();
