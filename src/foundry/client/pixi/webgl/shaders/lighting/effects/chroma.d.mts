export {};

declare global {
  /**
   * Chroma animation coloration shader
   */
  class ChromaColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace ChromaColorationShader {
    interface Any extends AnyChromaColorationShader {}
    type AnyConstructor = typeof AnyChromaColorationShader;
  }
}

declare abstract class AnyChromaColorationShader extends ChromaColorationShader {
  constructor(arg0: never, ...args: never[]);
}
