import { expectTypeOf } from "vitest";

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

  customProperty: string;
}

const avMaster = new AVMaster();

expectTypeOf(avMaster.settings).toEqualTypeOf<AVSettings>();
expectTypeOf(avMaster.config).toEqualTypeOf<AVConfig>();
expectTypeOf(avMaster.broadcasting).toEqualTypeOf<boolean>();
expectTypeOf(avMaster.mode).toEqualTypeOf<AVSettings.AV_MODES>();
expectTypeOf(avMaster.connect()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(avMaster.disconnect()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(avMaster.reestablish()).toEqualTypeOf<Promise<void>>();
expectTypeOf(avMaster.canUserBroadcastAudio("")).toEqualTypeOf<boolean>();
expectTypeOf(avMaster.canUserShareAudio("")).toEqualTypeOf<boolean>();
expectTypeOf(avMaster.canUserBroadcastVideo("")).toEqualTypeOf<boolean>();
expectTypeOf(avMaster.canUserShareVideo("")).toEqualTypeOf<boolean>();

declare global {
  interface WebRTCConfig {
    clientClass: typeof CustomAVCLient;
  }
}

CONFIG.WebRTC.clientClass = CustomAVCLient;

expectTypeOf(avMaster.client).toEqualTypeOf<CustomAVCLient>();
expectTypeOf(avMaster.client.customProperty).toEqualTypeOf<string>();

if (game instanceof Game) {
  expectTypeOf(game?.webrtc?.client.customProperty).toEqualTypeOf<string | undefined>();
}
