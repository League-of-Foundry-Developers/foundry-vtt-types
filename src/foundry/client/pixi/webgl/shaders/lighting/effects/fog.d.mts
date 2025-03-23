import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Fog animation coloration shader
   */
  class FogColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace FogColorationShader {
    interface Any extends AnyFogColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyFogColorationShader> {}
  }
}

declare abstract class AnyFogColorationShader extends FogColorationShader {
  constructor(...args: never);
}
