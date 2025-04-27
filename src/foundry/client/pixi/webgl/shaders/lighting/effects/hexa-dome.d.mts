import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Hexagonal dome animation coloration shader
   */
  class HexaDomeColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace HexaDomeColorationShader {
    interface Any extends AnyHexaDomeColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyHexaDomeColorationShader> {}
  }
}

declare abstract class AnyHexaDomeColorationShader extends HexaDomeColorationShader {
  constructor(...args: never);
}
