import type { Identity } from "#utils";

declare global {
  /**
   * Energy field animation coloration shader
   */
  class EnergyFieldColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace EnergyFieldColorationShader {
    interface Any extends AnyEnergyFieldColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyEnergyFieldColorationShader> {}
  }
}

declare abstract class AnyEnergyFieldColorationShader extends EnergyFieldColorationShader {
  constructor(...args: never);
}
