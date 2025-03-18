import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace SunburstIlluminationShader {
    interface Any extends AnySunburstIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnySunburstIlluminationShader> {}
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace SunburstColorationShader {
    interface Any extends AnySunburstColorationShader {}
    interface AnyConstructor extends Identity<typeof AnySunburstColorationShader> {}
  }
}

declare abstract class AnySunburstColorationShader extends SunburstColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySunburstIlluminationShader extends SunburstIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
