import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * A futuristic Force Grid animation.
 */
declare class ForceGridColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  protected static override _createFragmentShader(): string;
}

declare namespace ForceGridColorationShader {
  interface Any extends AnyForceGridColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyForceGridColorationShader> {}
}

export { ForceGridColorationShader };

declare abstract class AnyForceGridColorationShader extends ForceGridColorationShader {
  constructor(...args: never);
}
