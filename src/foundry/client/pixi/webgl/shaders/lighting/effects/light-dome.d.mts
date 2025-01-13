export {};

declare global {
  /**
   * Light dome animation coloration shader
   */
  class LightDomeColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace LightDomeColorationShader {
    type Any = AnyLightDomeColorationShader;
    type AnyConstructor = typeof AnyLightDomeColorationShader;
  }
}

declare abstract class AnyLightDomeColorationShader extends LightDomeColorationShader {
  constructor(arg0: never, ...args: never[]);
}
