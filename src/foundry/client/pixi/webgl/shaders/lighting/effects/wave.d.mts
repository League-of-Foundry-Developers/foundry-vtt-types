import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Wave animation illumination shader
   */
  class WaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace WaveIlluminationShader {
    interface Any extends AnyWaveIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnyWaveIlluminationShader> {}
  }

  /**
   * Wave animation coloration shader
   */
  class WaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace WaveColorationShader {
    interface Any extends AnyWaveColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyWaveColorationShader> {}
  }
}

declare abstract class AnyWaveColorationShader extends WaveColorationShader {
  constructor(...args: never);
}

declare abstract class AnyWaveIlluminationShader extends WaveIlluminationShader {
  constructor(...args: never);
}
