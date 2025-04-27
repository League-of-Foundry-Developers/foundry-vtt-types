import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Swirling rainbow animation coloration shader
   */
  class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace SwirlingRainbowColorationShader {
    interface Any extends AnySwirlingRainbowColorationShader {}
    interface AnyConstructor extends Identity<typeof AnySwirlingRainbowColorationShader> {}
  }
}

declare abstract class AnySwirlingRainbowColorationShader extends SwirlingRainbowColorationShader {
  constructor(...args: never);
}
