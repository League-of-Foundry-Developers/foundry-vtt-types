export {};

declare global {
  /**
   * Emanation animation coloration shader
   */
  class EmanationColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace EmanationColorationShader {
    type Any = AnyEmanationColorationShader;
    type AnyConstructor = typeof AnyEmanationColorationShader;
  }
}

declare abstract class AnyEmanationColorationShader extends EmanationColorationShader {
  constructor(arg0: never, ...args: never[]);
}
