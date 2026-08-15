import type { Identity } from "#utils";
import type AdaptiveDarknessShader from "../darkness-lighting.mjs";

/**
 * Black Hole animation illumination shader
 */
declare class BlackHoleDarknessShader extends AdaptiveDarknessShader {
  protected static override _createFragmentShader(): string;
}

declare namespace BlackHoleDarknessShader {
  interface Any extends AnyBlackHoleDarknessShader {}
  interface AnyConstructor extends Identity<typeof AnyBlackHoleDarknessShader> {}
}

export { BlackHoleDarknessShader };

declare abstract class AnyBlackHoleDarknessShader extends BlackHoleDarknessShader {
  constructor(...args: never);
}
