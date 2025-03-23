import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * A disco like star light.
   */
  class StarLightColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace StarLightColorationShader {
    interface Any extends AnyStarLightColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyStarLightColorationShader> {}
  }
}

declare abstract class AnyStarLightColorationShader extends StarLightColorationShader {
  constructor(...args: never);
}
