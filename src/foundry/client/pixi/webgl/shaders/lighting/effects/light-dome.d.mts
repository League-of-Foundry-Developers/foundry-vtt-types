import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Light dome animation coloration shader
   */
  class LightDomeColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace LightDomeColorationShader {
    interface Any extends AnyLightDomeColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyLightDomeColorationShader> {}
  }
}

declare abstract class AnyLightDomeColorationShader extends LightDomeColorationShader {
  constructor(...args: never);
}
