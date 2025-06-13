import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * A disco like star light.
 */
declare class StarLightColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace StarLightColorationShader {
  interface Any extends AnyStarLightColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyStarLightColorationShader> {}
}

export { StarLightColorationShader };

declare abstract class AnyStarLightColorationShader extends StarLightColorationShader {
  constructor(...args: never);
}
