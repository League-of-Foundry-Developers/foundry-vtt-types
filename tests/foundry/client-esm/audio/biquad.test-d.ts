import { expectTypeOf } from "vitest";

declare const context: AudioContext;
const biquadFilterEffect = new foundry.audio.BiquadFilterEffect(context);

expectTypeOf(biquadFilterEffect.intensity).toEqualTypeOf<number>();
expectTypeOf(biquadFilterEffect.update()).toEqualTypeOf<void>();
