import { expectType } from 'tsd';

declare class CustomAVCLient extends AVClient {
  initialize(): Promise<void>;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getAudioSinks(): Promise<Record<string, string>>;
  getAudioSources(): Promise<Record<string, string>>;
  getVideoSources(): Promise<Record<string, string>>;
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
    clientClass: CustomAVCLient;
  }
}

const avMaster = new AVMaster();

expectType<string>(avMaster.client.customProperty);
if (game instanceof Game) {
  expectType<string | undefined>(game?.webrtc?.client.customProperty);
}
