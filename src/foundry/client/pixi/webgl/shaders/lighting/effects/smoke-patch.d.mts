import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchColorationShader {
    interface Any extends AnySmokePatchColorationShader {}
    interface AnyConstructor extends Identity<typeof AnySmokePatchColorationShader> {}
  }

  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace SmokePatchIlluminationShader {
    interface Any extends AnySmokePatchIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnySmokePatchIlluminationShader> {}
  }
}

declare abstract class AnySmokePatchColorationShader extends SmokePatchColorationShader {
  constructor(...args: never);
}

declare abstract class AnySmokePatchIlluminationShader extends SmokePatchIlluminationShader {
  constructor(...args: never);
}
