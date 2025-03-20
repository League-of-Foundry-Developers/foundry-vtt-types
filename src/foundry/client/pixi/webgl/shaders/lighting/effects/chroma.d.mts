import type { Identity } from "../../../../../../../utils/index.d.mts";

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
    interface AnyConstructor extends Identity<typeof AnyChromaColorationShader> {}
  }
}

declare abstract class AnyChromaColorationShader extends ChromaColorationShader {
  constructor(arg0: never, ...args: never[]);
}
