import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * Ghost light animation illumination shader
 */
declare class GhostLightIlluminationShader extends AdaptiveIlluminationShader {
  protected static override _createFragmentShader(): string;
}

declare namespace GhostLightIlluminationShader {
  interface Any extends AnyGhostLightIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyGhostLightIlluminationShader> {}
}

/**
 * Ghost light animation coloration shader
 */
declare class GhostLightColorationShader extends AdaptiveColorationShader {
  protected static override _createFragmentShader(): string;
}

declare namespace GhostLightColorationShader {
  interface Any extends AnyGhostLightColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyGhostLightColorationShader> {}
}

export { GhostLightColorationShader, GhostLightIlluminationShader };

declare abstract class AnyGhostLightIlluminationShader extends GhostLightIlluminationShader {
  constructor(...args: never);
}

declare abstract class AnyGhostLightColorationShader extends GhostLightColorationShader {
  constructor(...args: never);
}
