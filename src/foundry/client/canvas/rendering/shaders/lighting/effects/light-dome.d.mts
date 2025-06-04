import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Light dome animation coloration shader
 */
declare class LightDomeColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace LightDomeColorationShader {
  interface Any extends AnyLightDomeColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyLightDomeColorationShader> {}
}

export { LightDomeColorationShader };

declare abstract class AnyLightDomeColorationShader extends LightDomeColorationShader {
  constructor(...args: never);
}
