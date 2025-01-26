import { expectTypeOf } from "vitest";

declare const avMaster: AVMaster;
declare const avSettings: AVSettings;

const avClient = new SimplePeerAVClient(avMaster, avSettings);

expectTypeOf(avClient.master).toEqualTypeOf<AVMaster>();
expectTypeOf(avClient.settings).toEqualTypeOf<AVSettings>();
expectTypeOf(avClient.isVoicePTT).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isVoiceAlways).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isVoiceActivated).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isMuted).toEqualTypeOf<boolean>();
expectTypeOf(avClient.getAudioSinks()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getAudioSources()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getVideoSources()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getLevelsStreamForUser("")).toEqualTypeOf<MediaStream | null | undefined>();
expectTypeOf(avClient.onSettingsChanged({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(avClient.localStream).toEqualTypeOf<MediaStream | null>();
expectTypeOf(avClient.levelsStream).toEqualTypeOf<MediaStream | null>();
expectTypeOf(avClient.peers).toEqualTypeOf<Map<string, SimplePeer.Instance>>();
expectTypeOf(avClient.remoteStreams).toEqualTypeOf<Map<string, MediaStream>>();
expectTypeOf(avClient.initializeLocalStream()).toEqualTypeOf<Promise<MediaStream | null>>();
expectTypeOf(avClient.initializePeerStream("")).toEqualTypeOf<Promise<SimplePeer.Instance>>();
expectTypeOf(avClient.connectPeer("")).toEqualTypeOf<SimplePeer.Instance>();
expectTypeOf(avClient.disconnectPeer("")).toEqualTypeOf<Promise<void>>();
expectTypeOf(avClient.disconnectAll()).toEqualTypeOf<Promise<Array<void>>>();
