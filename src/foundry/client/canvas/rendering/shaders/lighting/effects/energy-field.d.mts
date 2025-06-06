import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Energy field animation coloration shader
 */
declare class EnergyFieldColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace EnergyFieldColorationShader {
  interface Any extends AnyEnergyFieldColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyEnergyFieldColorationShader> {}
}

export { EnergyFieldColorationShader };

declare abstract class AnyEnergyFieldColorationShader extends EnergyFieldColorationShader {
  constructor(...args: never);
}
