import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Chroma animation coloration shader
 */
declare class ChromaColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  protected static override _createFragmentShader(): string;
}

declare namespace ChromaColorationShader {
  interface Any extends AnyChromaColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyChromaColorationShader> {}
}

export { ChromaColorationShader };

declare abstract class AnyChromaColorationShader extends ChromaColorationShader {
  constructor(...args: never);
}
