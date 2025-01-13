export {};
declare global {
  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchColorationShader {
    type Any = AnySmokePatchColorationShader;
    type AnyConstructor = typeof AnySmokePatchColorationShader;
  }

  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchIlluminationShader {
    type Any = AnySmokePatchIlluminationShader;
    type AnyConstructor = typeof AnySmokePatchIlluminationShader;
  }
}

declare abstract class AnySmokePatchColorationShader extends SmokePatchColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySmokePatchIlluminationShader extends SmokePatchIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
