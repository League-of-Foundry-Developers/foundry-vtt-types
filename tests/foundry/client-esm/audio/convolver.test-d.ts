import { expectTypeOf } from "vitest";

declare const context: AudioContext;
const effect = new foundry.audio.ConvolverEffect(context);

expectTypeOf(effect.intensity).toEqualTypeOf<number>();
expectTypeOf(effect.update({ intensity: 4 })).toEqualTypeOf<void>();

declare const audioNode: AudioNode;
declare const audioParam: AudioParam;
expectTypeOf(effect.disconnect()).toEqualTypeOf<void>();
expectTypeOf(effect.disconnect(audioNode)).toEqualTypeOf<void>();
expectTypeOf(effect.disconnect(audioParam)).toEqualTypeOf<void>();
expectTypeOf(effect.connect(audioNode)).toEqualTypeOf<AudioNode>();
expectTypeOf(effect.connect(audioParam)).toEqualTypeOf<AudioParam>();

expectTypeOf(effect.onConnectFrom(audioNode)).toEqualTypeOf<void>();
