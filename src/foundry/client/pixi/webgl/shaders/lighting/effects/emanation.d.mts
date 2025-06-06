import type { Identity } from "#utils";

declare global {
  /**
   * Emanation animation coloration shader
   */
  class EmanationColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace EmanationColorationShader {
    interface Any extends AnyEmanationColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyEmanationColorationShader> {}
  }
}

declare abstract class AnyEmanationColorationShader extends EmanationColorationShader {
  constructor(...args: never);
}
