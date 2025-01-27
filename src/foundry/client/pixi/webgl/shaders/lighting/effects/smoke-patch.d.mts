export {};
declare global {
  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchColorationShader {
    interface Any extends AnySmokePatchColorationShader {}
    type AnyConstructor = typeof AnySmokePatchColorationShader;
  }

  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchIlluminationShader {
    interface Any extends AnySmokePatchIlluminationShader {}
    type AnyConstructor = typeof AnySmokePatchIlluminationShader;
  }
}

declare abstract class AnySmokePatchColorationShader extends SmokePatchColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySmokePatchIlluminationShader extends SmokePatchIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
