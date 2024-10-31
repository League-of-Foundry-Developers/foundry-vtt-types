export {};

declare abstract class AnyEnergyFieldColorationShader extends EnergyFieldColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace EnergyFieldColorationShader {
    type AnyConstructor = typeof AnyEnergyFieldColorationShader;
  }

  /**
   * Energy field animation coloration shader
   */
  class EnergyFieldColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
