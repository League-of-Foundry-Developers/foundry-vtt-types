import { expectTypeOf } from "vitest";

const myBatchShaderGenerator = new BatchShaderGenerator("path/to/vertext/src", "path/to/fragTemplate/src", {
  someUniform: 5,
});

expectTypeOf(myBatchShaderGenerator.generateShader(1)).toEqualTypeOf<PIXI.Shader>();
