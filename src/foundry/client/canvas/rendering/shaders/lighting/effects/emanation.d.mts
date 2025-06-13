import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Emanation animation coloration shader
 */
declare class EmanationColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace EmanationColorationShader {
  interface Any extends AnyEmanationColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyEmanationColorationShader> {}
}

export { EmanationColorationShader };

declare abstract class AnyEmanationColorationShader extends EmanationColorationShader {
  constructor(...args: never);
}
