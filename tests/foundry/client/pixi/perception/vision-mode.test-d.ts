import { expectTypeOf } from "vitest";

// Not currently sure how to write tests for this - it's used as an internal field in VisionMode#defineSchema
// const myShaderField = new ShaderField();

class MyVisionMode extends VisionMode {
  _activate(source: VisionSource): void {
    source.animate(5000);
  }

  _deactivate(source: VisionSource): void {
    source.animation;
  }
}

const myVisionMode = new MyVisionMode({});

const myVisionSource = new VisionSource();

expectTypeOf(myVisionMode.activate(myVisionSource)).toEqualTypeOf<void>();
