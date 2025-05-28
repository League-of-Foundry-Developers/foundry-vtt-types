import { expectTypeOf } from "vitest";
import ConvolverEffect = foundry.audio.ConvolverEffect;

declare const context: AudioContext;
declare const buffer: AudioBuffer;

// @ts-expect-error construction requires an AudioContext
let effect = new ConvolverEffect();
effect = new ConvolverEffect(context);
effect = new ConvolverEffect(context, {});

// all possible properties, most of which are deep magic as far as the test author is concerned
effect = new ConvolverEffect(context, {
  intensity: 9,
  impulseResponsePath: "some/path/to/file.wav",
  buffer,
  channelCount: 7,
  channelCountMode: "explicit",
  channelInterpretation: "speakers",
  disableNormalization: false,
});

// What Foundry actually expects you to pass, based on CONFIG.soundEffects
effect = new ConvolverEffect(context, {
  intensity: 8,
});

effect = new ConvolverEffect(context, {
  intensity: undefined,
  impulseResponsePath: undefined,
  // the rest of the interface comes from a built-in that does not allow nullish values on any properties
});

expectTypeOf(effect.intensity).toEqualTypeOf<number>();
effect.intensity = 2; // setter; exactly equivalent to the following test
expectTypeOf(effect.update({ intensity: 2 })).toEqualTypeOf<void>();
// non-Finite `intensity`s are ignored
expectTypeOf(effect.update({ intensity: null })).toEqualTypeOf<void>();

declare const audioNode: AudioNode;
declare const audioParam: AudioParam;
expectTypeOf(effect.disconnect()).toEqualTypeOf<void>();
expectTypeOf(effect.disconnect(audioNode)).toEqualTypeOf<void>();
expectTypeOf(effect.disconnect(audioParam)).toEqualTypeOf<void>();
expectTypeOf(effect.connect(audioNode)).toEqualTypeOf<AudioNode>();
// Foundry doesn't support this overload, so its deprecated
expectTypeOf(effect.connect(audioParam)).toEqualTypeOf<AudioParam>();
expectTypeOf(effect.onConnectFrom(audioNode)).toEqualTypeOf<void>();
