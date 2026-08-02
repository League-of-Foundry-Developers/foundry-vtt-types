import { expectTypeOf } from "vitest";

import AVClient = foundry.av.AVClient;
import AVMaster = foundry.av.AVMaster;
import AVSettings = foundry.av.AVSettings;

declare class CustomAVCLient extends AVClient {
  override updateLocalStream(): Promise<void>;
  override initialize(): Promise<void>;
  override connect(): Promise<boolean>;
  override disconnect(): Promise<boolean>;
  override getConnectedUsers(): string[];
  override getMediaStreamForUser(userId: string): MediaStream | null | undefined;
  override getLevelsStreamForUser(userId: string): MediaStream | null | undefined;
  override isAudioEnabled(): boolean;
  override isVideoEnabled(): boolean;
  override toggleAudio(enable: boolean): void;
  override toggleBroadcast(broadcast: boolean): void;
  override toggleVideo(enable: boolean): void;
  override setUserVideo(userId: string, videoElement: HTMLVideoElement): Promise<void>;
}

declare const avMaster: AVMaster;
declare const avSettings: AVSettings;

const avClient = new CustomAVCLient(avMaster, avSettings);

expectTypeOf(avClient.master).toEqualTypeOf<AVMaster>();
expectTypeOf(avClient.settings).toEqualTypeOf<AVSettings>();
expectTypeOf(avClient.isVoicePTT).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isVoiceAlways).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isVoiceActivated).toEqualTypeOf<boolean>();
expectTypeOf(avClient.isMuted).toEqualTypeOf<boolean>();
expectTypeOf(avClient.getAudioSinks()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getAudioSources()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getVideoSources()).toEqualTypeOf<Promise<Record<string, string>>>();
expectTypeOf(avClient.getMediaStreamForUser("")).toEqualTypeOf<MediaStream | null | undefined>();
expectTypeOf(avClient.getLevelsStreamForUser("")).toEqualTypeOf<MediaStream | null | undefined>();
expectTypeOf(avClient.onSettingsChanged({})).toEqualTypeOf<void>();
