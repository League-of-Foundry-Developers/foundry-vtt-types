import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Swirling rainbow animation coloration shader
 */
declare class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace SwirlingRainbowColorationShader {
  interface Any extends AnySwirlingRainbowColorationShader {}
  interface AnyConstructor extends Identity<typeof AnySwirlingRainbowColorationShader> {}
}

export { SwirlingRainbowColorationShader };

declare abstract class AnySwirlingRainbowColorationShader extends SwirlingRainbowColorationShader {
  constructor(...args: never);
}
