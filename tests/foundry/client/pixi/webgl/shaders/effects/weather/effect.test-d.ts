import { expectTypeOf } from "vitest";

const myWeatherEffect = new WeatherShaderEffect({ enabled: true, blendMode: PIXI.BLEND_MODES.SCREEN }, FogShader);

expectTypeOf(myWeatherEffect.configure({})).toEqualTypeOf<void>();
