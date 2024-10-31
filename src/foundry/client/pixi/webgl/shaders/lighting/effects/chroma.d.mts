export {};

declare abstract class AnyChromaColorationShader extends ChromaColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace ChromaColorationShader {
    type AnyConstructor = typeof AnyChromaColorationShader;
  }

  /**
   * Chroma animation coloration shader
   */
  class ChromaColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
