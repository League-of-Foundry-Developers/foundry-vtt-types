import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Radial rainbow animation coloration shader
 */
declare class RadialRainbowColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  protected static override _createFragmentShader(): string;
}

declare namespace RadialRainbowColorationShader {
  interface Any extends AnyRadialRainbowColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyRadialRainbowColorationShader> {}
}

export { RadialRainbowColorationShader };

declare abstract class AnyRadialRainbowColorationShader extends RadialRainbowColorationShader {
  constructor(...args: never);
}
