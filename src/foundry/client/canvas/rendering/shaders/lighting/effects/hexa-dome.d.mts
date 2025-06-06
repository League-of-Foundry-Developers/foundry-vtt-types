import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Hexagonal dome animation coloration shader
 */
declare class HexaDomeColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace HexaDomeColorationShader {
  interface Any extends AnyHexaDomeColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyHexaDomeColorationShader> {}
}

export { HexaDomeColorationShader };

declare abstract class AnyHexaDomeColorationShader extends HexaDomeColorationShader {
  constructor(...args: never);
}
