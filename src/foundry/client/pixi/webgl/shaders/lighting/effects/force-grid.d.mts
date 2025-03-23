import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * A futuristic Force Grid animation.
   */
  class ForceGridColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace ForceGridColorationShader {
    interface Any extends AnyForceGridColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyForceGridColorationShader> {}
  }
}

declare abstract class AnyForceGridColorationShader extends ForceGridColorationShader {
  constructor(...args: never);
}
