import { expectType } from 'tsd';

const audioHelper = new AudioHelper();
expectType<AudioHelper>(audioHelper);
expectType<AudioContext | undefined>(audioHelper.context);
expectType<Map<string, AudioBuffer>>(audioHelper.buffers);
expectType<Map<string, Sound>>(audioHelper.sounds);
expectType<Map<number, Sound>>(audioHelper.playing);
expectType<(() => void)[]>(audioHelper.pending);
expectType<boolean>(audioHelper.locked);
expectType<number>(AudioHelper.levelAnalyserNativeInterval);
expectType<void>(AudioHelper.registerSettings());
expectType<Sound>(audioHelper.create({ src: 'a/path/to/some/sound/file.ogg' }));
expectType<Sound>(
  audioHelper.create({
    src: 'a/path/to/some/sound/file.ogg',
    singleton: false,
    preload: true,
    autoplay: true,
    autoplayOptions: { loop: true, offset: 42, volume: 0.5, fade: 3 }
  })
);
expectType<boolean>(AudioHelper.hasAudioExtension('a/path/to/some/sound/file.ogg'));
expectType<string>(AudioHelper.getDefaultSoundName('a/path/to/some/sound/file.ogg'));
expectType<Promise<Sound>>(audioHelper.play('a/path/to/some/sound/file.ogg'));
expectType<Promise<Sound>>(
  audioHelper.play('a/path/to/some/sound/file.ogg', { loop: true, offset: 42, volume: 0.5, fade: 3 })
);
expectType<void>(audioHelper.awaitFirstGesture());
expectType<Promise<Sound>>(audioHelper.preload('a/path/to/some/sound/file.ogg'));

declare const socket: io.Socket;

expectType<void>(AudioHelper._activateSocketListeners(socket));
expectType<Promise<Sound>>(
  AudioHelper.play({
    src: 'a/path/to/some/sound/file.ogg'
  })
);
expectType<Promise<Sound>>(
  AudioHelper.play(
    {
      src: 'a/path/to/some/sound/file.ogg',
      volume: 0.8,
      autoplay: false,
      loop: true
    },
    true
  )
);
expectType<Promise<Sound>>(AudioHelper.preloadSound('a/path/to/some/sound/file.ogg'));
expectType<number>(AudioHelper.inputToVolume(0.5));
expectType<number>(AudioHelper.inputToVolume('0.5', 1.7));
expectType<number>(AudioHelper.volumeToInput(0.5));
expectType<number>(AudioHelper.volumeToInput(0.5, 1.7));
expectType<AudioContext | null>(audioHelper.getAudioContext());

declare const stream: MediaStream;
declare const callback: (maxDecibel: number, fftArray: Float32Array) => void;

expectType<boolean>(audioHelper.startLevelReports('some id', stream, callback));
expectType<boolean>(audioHelper.startLevelReports('some id', stream, callback, 60, 0.2));
expectType<void>(audioHelper.stopLevelReports('some id'));
