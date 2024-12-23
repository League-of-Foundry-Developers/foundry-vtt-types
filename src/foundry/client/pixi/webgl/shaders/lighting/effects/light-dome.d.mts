export {};

declare abstract class AnyLightDomeColorationShader extends LightDomeColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace LightDomeColorationShader {
    type AnyConstructor = typeof AnyLightDomeColorationShader;
  }

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
}
