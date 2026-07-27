import type { DeepPartial } from "#utils";
import type { KeyboardManager } from "#client/helpers/interaction/_module.d.mts";
import type { AVClient, AVSettings } from "#client/av/_module.d.mts";
import type { AVConfig } from "#client/applications/settings/menus/_module.d.mts";

/**
 * The master Audio/Video controller instance.
 * This is available as the singleton game.webrtc
 */
declare class AVMaster {
  constructor();

  /** @privateRemarks Defined during construction. */
  settings: AVSettings;

  /** @privateRemarks Defined during construction. */
  config: AVConfig;

  /**
   * The Audio/Video client class
   * @privateRemarks Defined during construction.
   */
  client: AVClient.Implementation;

  /**
   * A flag to track whether the current user is actively broadcasting their microphone.
   * @defaultValue `false`
   * @privateRemarks Defined during construction.
   */
  broadcasting: boolean;

  /**
   * @defaultValue `{ speaking: false, volumeHistories: [] }`
   * @internal
   * @privateRemarks Defined during construction by simple assignment.
   */
  _speakingData: AVMaster.SpeakingData;

  /**
   * @defaultValue `0`
   * @internal
   * @privateRemarks Defined during construction by simple assignment.
   */
  _pttMuteTimeout: number;

  /**
   * @defaultValue `3000`
   * @internal
   * @privateRemarks Defined during construction by simple assignment.
   */
  _reconnectPeriodMS: number;

  get mode(): AVSettings.AV_MODES;

  /**
   * Connect to the Audio/Video client.
   * @returns Was the connection attempt successful?
   */
  connect(): Promise<boolean>;

  /**
   * Disconnect from the Audio/Video client.
   * @returns Whether an existing connection was terminated?
   */
  disconnect(): Promise<boolean>;

  /**
   * Callback actions to take when the user becomes disconnected from the server.
   */
  reestablish(): Promise<void>;

  /**
   * A user can broadcast audio if the AV mode is compatible and if they are allowed to broadcast.
   */
  canUserBroadcastAudio(userId: string): boolean;

  /**
   * A user can share audio if they are allowed to broadcast and if they have not muted themselves or been blocked.
   */
  canUserShareAudio(userId: string): boolean;

  /**
   * A user can broadcast video if the AV mode is compatible and if they are allowed to broadcast.
   */
  canUserBroadcastVideo(userId: string): boolean;

  /**
   * A user can share video if they are allowed to broadcast and if they have not hidden themselves or been blocked.
   */
  canUserShareVideo(userId: string): boolean;

  /**
   * Trigger a change in the audio broadcasting state when using a push-to-talk workflow.
   * @param intent - The user's intent to broadcast. Whether an actual broadcast occurs will depend
   *                 on whether or not the user has muted their audio feed.
   */
  broadcast(intent: boolean): void;

  /**
   * Set up audio level listeners to handle voice activation detection workflow.
   * @param mode - The currently selected voice broadcasting mode
   * @internal
   */
  _initializeUserVoiceDetection(mode: AVSettings.VOICE_MODES): void;

  /**
   * Activate voice detection tracking for a userId on a provided MediaStream.
   * Currently only a MediaStream is supported because MediaStreamTrack processing is not yet supported cross-browser.
   * @param stream - The MediaStream which corresponds to that User
   * @param ms     - A number of milliseconds which represents the voice activation volume interval
   *                 (default: `CONFIG.WebRTC.detectPeerVolumeInterval`)
   */
  activateVoiceDetection(stream: MediaStream, ms?: number): void;

  /**
   * Actions which the orchestration layer should take when a peer user disconnects from the audio/video service.
   */
  deactivateVoiceDetection(): void;

  /**
   * Handle activation of a push-to-talk key or button.
   * @param context - The context data of the event
   * @internal
   */
  _onPTTStart(context: KeyboardManager.KeyboardEventContext): void;

  /**
   * Handle deactivation of a push-to-talk key or button.
   * @param context - The context data of the event
   * @internal
   */
  _onPTTEnd(context: KeyboardManager.KeyboardEventContext): void;

  render(): void;

  /**
   * Respond to changes which occur to AV Settings.
   * Changes are handled in descending order of impact.
   * @param changed - The object of changed AV settings
   */
  onSettingsChanged(changed: DeepPartial<AVSettings.Settings>): void;

  debug(message: string): void;
}

declare namespace AVMaster {
  interface SpeakingData {
    speaking: boolean;
    volumeHistories: number[];
  }
}

export default AVMaster;
