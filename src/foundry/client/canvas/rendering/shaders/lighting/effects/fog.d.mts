import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Fog animation coloration shader
 */
declare class FogColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  protected static override _createFragmentShader(): string;
}

declare namespace FogColorationShader {
  interface Any extends AnyFogColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyFogColorationShader> {}
}

export { FogColorationShader };

declare abstract class AnyFogColorationShader extends FogColorationShader {
  constructor(...args: never);
}
