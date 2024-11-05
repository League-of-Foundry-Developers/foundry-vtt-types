export {};

declare abstract class AnyEmanationColorationShader extends EmanationColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace EmanationColorationShader {
    type AnyConstructor = typeof AnyEmanationColorationShader;
  }

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
}
