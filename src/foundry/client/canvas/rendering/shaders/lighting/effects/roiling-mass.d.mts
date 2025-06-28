import type { Identity } from "#utils";
import type AdaptiveDarknessShader from "../darkness-lighting.mjs";

/**
 * Roiling mass illumination shader: intended primarily for darkness
 */
declare class RoilingDarknessShader extends AdaptiveDarknessShader {
  static override fragmentShader: string;
}

declare namespace RoilingDarknessShader {
  interface Any extends AnyRoilingDarknessShader {}
  interface AnyConstructor extends Identity<typeof AnyRoilingDarknessShader> {}
}

export { RoilingDarknessShader };

declare abstract class AnyRoilingDarknessShader extends RoilingDarknessShader {
  constructor(...args: never);
}
