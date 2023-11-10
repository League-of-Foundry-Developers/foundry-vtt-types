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

declare global {
  interface WebRTCConfig {
    clientClass: typeof CustomAVCLient;
  }
}

CONFIG.WebRTC.clientClass = CustomAVCLient;

const avMaster = new AVMaster();

expectTypeOf(avMaster.client.customProperty).toEqualTypeOf<string>();
if (game instanceof Game) {
  expectTypeOf(game?.webrtc?.client.customProperty).toEqualTypeOf<string | undefined>();
}
