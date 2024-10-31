export {};

declare abstract class AnySmokePatchColorationShader extends SmokePatchColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySmokePatchIlluminationShader extends SmokePatchIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SmokePatchColorationShader {
    type AnyConstructor = typeof AnySmokePatchColorationShader;
  }

  namespace SmokePatchIlluminationShader {
    type AnyConstructor = typeof AnySmokePatchIlluminationShader;
  }

  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
