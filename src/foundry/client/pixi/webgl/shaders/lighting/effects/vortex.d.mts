import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Vortex animation coloration shader
   */
  class VortexColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace VortexColorationShader {
    interface Any extends AnyVortexColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyVortexColorationShader> {}
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace VortexIlluminationShader {
    interface Any extends AnyVortexIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnyVortexIlluminationShader> {}
  }
}

declare abstract class AnyVortexColorationShader extends VortexColorationShader {
  constructor(...args: never);
}

declare abstract class AnyVortexIlluminationShader extends VortexIlluminationShader {
  constructor(...args: never);
}
