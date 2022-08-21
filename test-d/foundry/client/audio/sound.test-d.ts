import { expectType } from "tsd";

const sound = new Sound("a/path/to/some/sound/file.ogg");

expectType<Sound>(sound);
expectType<number>(sound.id);
expectType<string>(sound.src);
expectType<AudioContainer>(sound.container);
expectType<number | undefined>(sound.startTime);
expectType<number | undefined>(sound.pausedTime);
expectType<Sound.EventCallbacks>(sound.events);
expectType<Promise<void> | undefined>(sound.loading);
expectType<AudioContext>(sound.context);
expectType<AudioBufferSourceNode | MediaElementAudioSourceNode | undefined>(sound.node);
expectType<AudioParam | undefined>(sound.gain);
expectType<number | undefined>(sound.currentTime);
expectType<number | undefined>(sound.duration);
expectType<boolean>(sound.loaded);
expectType<boolean>(sound.failed);
expectType<boolean>(sound.playing);
expectType<boolean>(sound.loop);
expectType<number | undefined>(sound.volume);
expectType<Promise<void>>(sound.fade(0));
expectType<Promise<void>>(sound.fade(0, { duration: 42, from: 0.5, type: "exponential" }));
expectType<Promise<Sound>>(sound.load());
expectType<Promise<Sound>>(
  sound.load({ autoplay: true, autoplayOptions: { loop: true, offset: 2, volume: 0.7, fade: 3 } })
);
expectType<void>(sound.play());
expectType<void>(sound.play({ loop: true, offset: 2, volume: 0.7, fade: 3 }));
expectType<void>(sound.pause());
expectType<void>(sound.stop());

declare const soundCallback: (sound: Sound) => void;

expectType<Promise<void>>(sound.schedule(soundCallback, 42));
expectType<void>(sound.emit("pause"));
expectType<void>(sound.off("end", 42));
expectType<void>(sound.off("start", soundCallback));
expectType<number>(sound.on("stop", soundCallback));
