import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * A patch of smoke
 */
declare class SmokePatchColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;
}

declare namespace SmokePatchColorationShader {
  interface Any extends AnySmokePatchColorationShader {}
  interface AnyConstructor extends Identity<typeof AnySmokePatchColorationShader> {}
}

/**
 * A patch of smoke
 */
declare class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace SmokePatchIlluminationShader {
  interface Any extends AnySmokePatchIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnySmokePatchIlluminationShader> {}
}

export { SmokePatchColorationShader, SmokePatchIlluminationShader };

declare abstract class AnySmokePatchColorationShader extends SmokePatchColorationShader {
  constructor(...args: never);
}

declare abstract class AnySmokePatchIlluminationShader extends SmokePatchIlluminationShader {
  constructor(...args: never);
}
