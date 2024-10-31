export {};

declare abstract class AnyHexaDomeColorationShader extends HexaDomeColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace HexaDomeColorationShader {
    type AnyConstructor = typeof AnyHexaDomeColorationShader;
  }

  /**
   * Hexagonal dome animation coloration shader
   */
  class HexaDomeColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
