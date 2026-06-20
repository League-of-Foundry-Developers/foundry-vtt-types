import type { DeepPartial, Identity } from "#utils";
import type { AVClient, AVSettings } from "#client/av/_module.d.mts";

/**
 * An implementation of the AVClient which uses the simple-peer library and the Foundry socket server for signaling.
 * Credit to bekit#4213 for identifying simple-peer as a viable technology and providing a POC implementation.
 */
declare class SimplePeerAVClient extends AVClient {
  /**
   * The local Stream which captures input video and audio
   * @defaultValue `null`
   */
  localStream: MediaStream | null;

  /**
   * The dedicated audio stream used to measure volume levels for voice activity detection.
   * @defaultValue `null`
   */
  levelsStream: MediaStream | null;

  /**
   * A mapping of connected peers
   */
  peers: Map<string, SimplePeer.Instance>;

  /**
   * A mapping of connected remote streams
   */
  remoteStreams: Map<string, MediaStream>;

  /**
   * Has the client been successfully initialized?
   * @defaultValue `false`
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _initialized: never;

  /**
   * Is outbound broadcast of local audio enabled?
   * @defaultValue `false`
   */
  audioBroadcastEnabled: boolean;

  /**
   * The polling interval ID for connected users that might have unexpectedly dropped out of our peer network.
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _connectionPoll: never;

  override connect(): Promise<boolean>;

  /**
   * Try to establish a peer connection with each user connected to the server.
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _connect(): never;

  override disconnect(): Promise<boolean>;

  override initialize(): Promise<void>;

  override getConnectedUsers(): string[];

  override getMediaStreamForUser(userId: string): MediaStream | null | undefined;

  override getLevelsStreamForUser(userId: string): MediaStream | null | undefined;

  override isAudioEnabled(): boolean;

  override isVideoEnabled(): boolean;

  override toggleAudio(enable: boolean): void;

  override toggleBroadcast(broadcast: boolean): void;

  override toggleVideo(enable: boolean): void;

  override setUserVideo(userId: string, videoElement: HTMLVideoElement): Promise<void>;

  /**
   * Initialize a local media stream for the current user
   */
  initializeLocalStream(): Promise<MediaStream | null>;

  /**
   * Attempt to create local media streams.
   * @param params - Parameters for the getUserMedia request.
   * @returns The created MediaStream or an error.
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _createMediaStream(params: never): never;

  /**
   * Listen for Audio/Video updates on the av socket to broker connections between peers
   */
  activateSocketListeners(): void;

  /**
   * Initialize a stream connection with a new peer
   * @param userId - The Foundry user ID for which the peer stream should be established
   * @returns A Promise which resolves once the peer stream is initialized
   */
  initializePeerStream(userId: string): Promise<SimplePeer.Instance>;

  /**
   * Receive a request to establish a peer signal with some other User id
   * @param userId - The Foundry user ID who is requesting to establish a connection
   * @param data   - The connection details provided by SimplePeer
   */
  receiveSignal(userId: string, data: SimplePeer.SignalData): void;

  /**
   * Connect to a peer directly, either as the initiator or as the receiver
   * @param userId      - The Foundry user ID with whom we are connecting
   * @param isInitiator - Is the current user initiating the connection, or responding to it?
   *                      (default: `false`)
   * @returns The constructed and configured SimplePeer instance
   */
  connectPeer(userId: string, isInitiator?: boolean): SimplePeer.Instance;

  /**
   * Create the SimplePeer instance for the desired peer connection.
   * Modules may implement more advanced connection strategies by overriding this method.
   * @param userId      - The Foundry user ID with whom we are connecting
   * @param isInitiator - Is the current user initiating the connection, or responding to it?
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  _createPeerConnection(userId: never, isInitiator: never): never;

  /**
   * Setup the custom TURN relay to be used in subsequent calls if there is one configured.
   * TURN credentials are mandatory in WebRTC.
   * @param options - The SimplePeer configuration object.
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  _setupCustomTURN(options: never): never;

  /**
   * Disconnect from a peer by stopping current stream tracks and destroying the SimplePeer instance
   * @param userId - The Foundry user ID from whom we are disconnecting
   * @returns A Promise which resolves once the disconnection is complete
   */
  disconnectPeer(userId: string): Promise<void>;

  /**
   * Disconnect from all current peer streams
   * @returns A Promise which resolves once all peers have been disconnected
   */
  disconnectAll(): Promise<Array<void>>;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  override onSettingsChanged(changed: DeepPartial<AVSettings.Settings>): Promise<void>;

  override updateLocalStream(): Promise<void>;

  #SimplePeerAVClient: true;
}

declare namespace SimplePeerAVClient {
  interface Any extends AnySimplePeerAVClient {}
  interface AnyConstructor extends Identity<typeof AnySimplePeerAVClient> {}
}

declare abstract class AnySimplePeerAVClient extends SimplePeerAVClient {
  constructor(...args: never);
}

export default SimplePeerAVClient;
