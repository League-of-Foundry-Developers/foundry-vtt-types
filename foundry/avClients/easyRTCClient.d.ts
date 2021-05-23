/**
 * An AVClient implementation that uses WebRTC and the EasyRTC library.
 */
declare class EasyRTCClient extends AVClient {
  /**
   * @param master   - The master orchestration instance
   * @param settings - The audio/video settings being used
   */
  constructor(master: AVMaster, settings: AVSettings);

  /**
   * An array of easyRtcId peers that rejected our call. Avoid continually trying to call the same peer.
   * @defaultValue `[]`
   */
  protected _callRejections: string[];

  /**
   * Store the name of the joined EasyRTC room
   * @defaultValue `null`
   */
  protected _room: string | null;

  /**
   * A mapping of easyRtcId peer ids to Foundry User ids
   * @defaultValue `{}`
   */
  protected _usernameCache: Record<string, string>;

  /** @override */
  connect(): Promise<true>;

  /** @override */
  disconnect(): Promise<true>;

  /**
   * Enable or disable the audio tracks in a stream
   *
   * Disabling a track represents what a typical user would consider muting it.
   * We use the term 'enable' here instead of 'mute' to match the MediaStreamTrack
   * field name and to avoid confusion with the 'muted' read-only field of the MediaStreamTrack
   * as well as the video element's `muted` field which only stops playing the audio.
   * Muting by definition stops rendering any of the data, while a disabled track in this case
   * is still rendering its data, but is simply generating disabled content (silence and black frames)
   * See https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/enabled
   *
   * @param stream - The stream to modify
   * @param enable - (optional) Whether to enable or disable the tracks
   *                 (default: `true`)
   */
  enableStreamAudio(stream: MediaStream, enable?: boolean): void;

  /**
   * Enable or disable the video tracks in a stream
   *
   * Disabling a track represents what a typical user would consider muting it. We use the term 'enable' here instead
   * of 'mute' to match the MediaStreamTrack field name and to avoid confusion with the 'muted' read-only field of the
   * MediaStreamTrack as well as the video element's `muted` field which only stops playing the audio.
   *
   * Muting by definition stops rendering any of the data, while a disabled track in this case is still rendering its
   * data, but is simply generating disabled content (silence and black frames).
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/enabled
   *
   * @param stream - The stream to modify
   * @param enable - (optional) Whether to enable or disable the tracks
   *                 (default: `true`)
   */
  enableStreamVideo(stream: MediaStream, enable?: boolean): void;

  /** @override */
  getAudioSinks(): Promise<Record<string, string>>;

  /** @override */
  getAudioSources(): Promise<Record<string, string>>;

  /**
   * Get MediaStream instances for every connected peer in the room.
   * @returns - An array of stream information for each peer
   */
  getConnectedStreams(): EasyRTCClient.StreamInfo;

  /** @override */
  getConnectedUsers(): string[];

  /** @override */
  getMediaStreamForUser(userId: string): MediaStream;

  /**
   * @deprecated Use `getMediaStreamForUser` instead
   */
  getStreamForUser(userId: string): MediaStream;

  /** @override */
  getVideoSources(): Promise<Record<string, string>>;

  /** @override */
  initialize(): Promise<void>;

  /** @override */
  isAudioEnabled(): boolean;

  /** @override */
  isVideoEnabled(): boolean;

  /** @override */
  setUserVideo(userId: string, videoElement: HTMLVideoElement): Promise<void>;

  /**
   * Handle a request to enable or disable the outbound audio feed for the current game user.
   * @param enable - Whether the outbound audio track should be enabled (true) or disabled (false)
   */
  toggleAudio(enable: boolean): void;

  /**
   * Set whether the outbound audio feed for the current game user is actively broadcasting.
   * This can only be true if audio is enabled, but may be false if using push-to-talk or voice activation modes.
   * @param broadcast - Whether outbound audio should be sent to connected peers or not?
   */
  toggleBroadcast(broadcast: boolean): void;

  /**
   * Handle a request to enable or disable the outbound video feed for the current game user.
   * @param enable - Whether the outbound video track should be enabled (true) or disabled (false)
   */
  toggleVideo(enable: boolean): void;

  /**
   * Callback used to check if an incoming call should be accepted or not
   * @param easyRtcId - The peer ID of the caller
   * @param acceptor  - Function to call with whether or not to accept the call and the media streams to use
   */
  protected _answerIncomingCall(
    easyRtcId: string,
    acceptor: (accept: boolean, streamNames: string[] | null) => unknown
  ): void;

  /**
   * Close the local stream
   */
  protected _closeLocalStream(temporary?: boolean): void;

  /**
   * Connect to the WebRTC server and configure ICE/TURN servers
   * @returns Was the server connected?
   */
  protected _connectServer({
    type,
    room,
    url,
    username,
    password
  }: {
    type?: 'FVTT' | 'custom';
    room?: string;
    url: string;
    username: string;
    password: string;
  }): Promise<boolean>;

  /**
   * Create a MediaStream to be sent to a specific peer.
   * This stream should control whether outbound video and audio is transmitted.
   * Create the stream as a clone of the current master stream for configuration on a peer-to-peer basis.
   */
  protected _createStreamForPeer(peer: string): MediaStream | null;

  /**
   * Transform the device info array from easyrtc into an object with `{id: label}` keys
   * @param list - The list of devices
   */
  protected _deviceInfoToObject(list: EasyRTCClient.DeviceSource[]): Record<string, string>;

  /**
   * Enables or disables media tracks
   * See https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/enabled
   * @param tracks - The tracks to enable/disable
   * @param enable - Whether to enable or disable the tracks
   */
  protected _enableMediaTracks(tracks: MediaStreamTrack[], enable: boolean): void;

  /**
   * Define media constraints to control the resolution and devices used.
   * We need to set our own constraints so we can specify a min/max range of resolutions.
   */
  protected _getStreamMediaConstraints(
    videoSrc: string | undefined | null,
    audioSrc: string | undefined | null
  ): EasyRTCClient.StreamMediaConstraints;

  /**
   * Initialize a local media stream
   * Capture the local audio and video and returns the stream associated with them.
   *
   * If `temporary` is false (default), then this will initialize the master stream, not the actual
   * streams being sent to individual users. However, if a master stream was already created, it
   * will automatically get closed and every individual streams derived from it that are being sent
   * to connected users will be removed from the calls.
   * Each established or subsequent calls will receive a copy of the created stream (A/V depending on user permissions)
   *
   * If `temporary` is true then this only applies to a temporary stream and does not affect
   * the master stream or any streams in existing calls.
   * Note that this assumes only one temporary stream can be created at a time.
   *
   * @param audioSrc  - ID of the audio source to capture from or null to disable Audio
   *                    (default: `undefined`)
   * @param videoSrc  - ID of the video source to capture from or null to disable Video
   *                    (default: `undefined`)
   * @param temporary - Whether to create a temporary stream or the master stream
   *                    (default: `false`)
   * @returns Returns the local stream or `null` if none could be created
   */
  protected _initializeLocal({
    audioSrc,
    videoSrc,
    temporary
  }?: {
    audioSrc?: string | null;
    videoSrc?: string | null;
    temporary?: boolean;
  }): Promise<MediaStream>;

  /**
   * Called when the connection to the signaling server is lost (unintentionally).
   * This handles the case of when connectivity is interrupted non-deliberately.
   */
  protected _onConnectionLost(): void;

  /**
   * Called when an error occurs
   */
  protected _onError({ errorCode, errorText }: { errorCode: string; errorText: string }): void;

  /**
   * Called when the connection with a peer has been lost and the ICE machine was unable to re-establish it.
   * In case of irrecoverable connection loss with the peer, hanging up the call will cause a roomOccupantListener
   * signal to be sent and we will automatically try to reconnect to the user.
   * First make sure that they are still in the room so we don't try to hangup with an easyRtcId that is invalid.
   */
  protected _onPeerClosed(easyRtcId: string): void;

  /**
   * Called when a remote stream is added to an existing call
   */
  protected _onPeerConnect(easyRtcId: string, stream: MediaStream): void;

  /**
   * Called when a remote stream is removed from an existing call
   */
  protected _onPeerDisconnect(easyRtcId: string, stream: MediaStream, streamName: string): void;

  /**
   * Called whenever there is a change in the list of occupants in a room.
   * It can also be called if a peer's state changes, such as when a call is established or ended.
   * For each other peer in the room, record their user ID and establish a call with them.
   * Record the username associated with each peer.
   *
   * Important: We need to make sure that only user initiates a call, instead of both trying to call each other.
   * Resolve this by having the alphabetically greater ID call the other peer.
   *
   * @param roomName    - The room name where occupants have changed
   * @param otherPeople - An array of other peers in the room
   * @param myInfo      - My own connection info
   */
  protected _onRoomOccupantsChange(
    roomName: string,
    otherPeople: Record<string, any>,
    myInfo: { easyrtcid: string; [key: string]: any }
  ): Promise<void>;

  /**
   * Create an open a local stream when initially connecting to the server.
   * This local stream becomes the "master" stream which tracks your own device inputs.
   * The master stream is cloned to provide a stream to every connected peer.
   */
  protected _openLocalStream(
    audioSrc: string | undefined | null,
    videoSrc: string | undefined | null,
    temporary?: boolean
  ): Promise<MediaStream | null>;

  /**
   * Call a peer and establish a connection with them
   * @param easyRtcId - The peer ID to call
   * @returns Returns false if no call was made or true if the call is successful.
   * @throws raises an Exception in case of failure to establish the call.
   */
  protected _performCall(easyRtcId: string): Promise<boolean>;

  /**
   * Setup the custom TURN relay to be used in subsequent calls if there is one configured
   * If configured, setup custom TURN configuration for future calls. Turn credentials are mandatory in WebRTC.
   */
  protected _setupCustomTURN(): void;

  /**
   * Obtain the EasyRTC user ID of a user based on their Foundry VTT user ID
   * @param userId - The ID of the user
   * @returns The EasyRtcId of the peer
   */
  protected _userIdToEasyRtcId(userId: string): string | null;

  /**
   * Called when the connection with a peer has been established
   */
  protected onPeerOpen(easyRtcId: string): void;
}

declare namespace EasyRTCClient {
  interface StreamMediaConstraints {
    audio:
      | {
          deviceId: string | undefined | null;
        }
      | false;
    video:
      | {
          /**
           * @defaultValue `4/3`
           */
          aspectRatio: number;

          width: {
            /**
             * @defaultValue `32=`
             */
            ideal: number;

            /**
             * @defaultValue `640`
             */
            max: number;

            /**
             * @defaultValue `160`
             */
            min: number;
          };

          height: {
            /**
             * @defaultValue `240`
             */
            ideal: number;

            /**
             * @defaultValue `480`
             */
            max: number;

            /**
             * @defaultValue `120`
             */
            min: number;
          };

          frameRate: {
            /**
             * @defaultValue `15`
             */
            ideal: number;

            /**
             * @defaultValue `30`
             */
            max: number;
          };

          deviceId: string | undefined | null;
        }
      | false;
  }

  interface DeviceSource {
    deviceId: string;
    groupId: string;
    kind: 'audio' | 'video';
    label: string;
  }

  interface StreamInfo {
    connection: RTCPeerConnection;
    id: string;
    local: MediaStream | null;
    remote: MediaStream | null;
  }
}
