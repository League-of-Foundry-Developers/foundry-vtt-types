export {};

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
    type AnyConstructor = typeof AnyHexaDomeColorationShader;
  }
}

declare abstract class AnyHexaDomeColorationShader extends HexaDomeColorationShader {
  constructor(arg0: never, ...args: never[]);
}
