import { expectTypeOf } from "vitest";

import AVClient = foundry.av.AVClient;
import AVMaster = foundry.av.AVMaster;

declare class CustomAVCLient extends AVClient {
  updateLocalStream(): Promise<void>;
  initialize(): Promise<void>;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getConnectedUsers(): string[];
  getMediaStreamForUser(userId: string): MediaStream | null;
  isAudioEnabled(): boolean;
  isVideoEnabled(): boolean;
  toggleAudio(enable: boolean): void;
  toggleBroadcast(broadcast: boolean): void;
  toggleVideo(enable: boolean): void;
  setUserVideo(userId: string, videoElement: HTMLVideoElement): Promise<void>;
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
expectTypeOf(avClient.getLevelsStreamForUser("")).toEqualTypeOf<MediaStream | null | undefined>();
expectTypeOf(avClient.onSettingsChanged({})).toEqualTypeOf<void>();
