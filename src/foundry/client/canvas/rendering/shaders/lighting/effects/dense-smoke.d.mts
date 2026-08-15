import type { Identity } from "#utils";
import type AdaptiveDarknessShader from "../darkness-lighting.mjs";

/**
 * Creates a dense smoke area
 */
declare class DenseSmokeDarknessShader extends AdaptiveDarknessShader {
  protected static override _createFragmentShader(): string;
}

declare namespace DenseSmokeDarknessShader {
  interface Any extends AnyDenseSmokeDarknessShader {}
  interface AnyConstructor extends Identity<typeof AnyDenseSmokeDarknessShader> {}
}

export { DenseSmokeDarknessShader };

declare abstract class AnyDenseSmokeDarknessShader extends DenseSmokeDarknessShader {
  constructor(...args: never);
}
