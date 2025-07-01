import "youtube";
import type { SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { Identity, InexactPartial, ValueOf } from "#utils";
import type { ImageHelper } from "./_module.d.mts";

/**
 * A helper class to provide common functionality for working with HTML5 video objects
 * A singleton instance of this class is available as `game.video`
 */
declare class VideoHelper {
  /**
   * @remarks
   * @throws "You may not re-initialize the singleton {@linkcode VideoHelper}. Use {@linkcode game.video} instead."
   */
  constructor();

  /**
   * A user gesture must be registered before video playback can begin.
   * This Set records the video elements which await such a gesture.
   */
  pending: Set<HTMLVideoElement>;

  /**
   * A mapping of base64 video thumbnail images
   */
  thumbs: Map<string, string>;

  /**
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `true`
   */
  locked: boolean;

  /**
   * Return the HTML element which provides the source for a loaded texture.
   * @param mesh - The rendered mesh
   * @returns The source HTML element
   */
  getSourceElement(mesh: PIXI.Sprite | SpriteMesh): HTMLImageElement | HTMLVideoElement | null;

  /**
   * Get the video element source corresponding to a Sprite or SpriteMesh.
   * @param object - The PIXI source
   * @returns The source video element or null
   */
  getVideoSource(object: PIXI.Sprite | PIXI.Texture | SpriteMesh): HTMLVideoElement | null;

  /**
   * Clone a video texture so that it can be played independently of the original base texture.
   * @param source - The video element source
   * @returns An unlinked PIXI.Texture which can be played independently
   */
  cloneTexture(source: HTMLVideoElement): Promise<PIXI.Texture>;

  /**
   * Check if a source has a video extension.
   * @param src - The source.
   * @returns If the source has a video extension or not.
   */
  static hasVideoExtension(src: string): boolean;

  /**
   * Play a single video source
   * If playback is not yet enabled, add the video to the pending queue
   * @param video   - The VIDEO element to play
   * @param options - Additional options for modifying video playback (default: `{}`)
   */
  play(video: HTMLVideoElement, options?: VideoHelper.PlayOptions): void;

  /**
   * Stop a single video source
   * @param video - The VIDEO element to stop
   */
  stop(video: HTMLVideoElement): void;

  /**
   * Register an event listener to await the first mousemove gesture and begin playback once observed
   * A user interaction must involve a mouse click or keypress.
   * Listen for any of these events, and handle the first observed gesture.
   */
  awaitFirstGesture(): void;

  /**
   * Create and cache a static thumbnail to use for the video.
   * The thumbnail is cached using the video file path or URL.
   * @param src     - The source video URL
   * @param options - Thumbnail creation options, including width and height
   * @returns The created and cached base64 thumbnail image, or a placeholder image if the canvas is
   *          disabled and no thumbnail can be generated.
   */
  createThumbnail(src: string, options?: ImageHelper.CreateThumbnailOptions): Promise<string>;

  /**
   * Lazily-load the YouTube API and retrieve a Player instance for a given iframe.
   * @param id     - The iframe ID.
   * @param config - A player config object. See {@link https://developers.google.com/youtube/iframe_api_reference} for reference.
   */
  getYouTubePlayer(id: string, config?: YT.PlayerOptions): Promise<YT.Player>;

  /**
   * Retrieve a YouTube video ID from a URL.
   * @param url - The URL.
   */
  getYouTubeId(url: string): string;

  /**
   * Take a URL to a YouTube video and convert it into a URL suitable for embedding in a YouTube iframe.
   * @param url  - The URL to convert.
   * @param vars - YouTube player parameters. (default: `{}`)
   * @returns The YouTube embed URL.
   */
  getYouTubeEmbedURL(url: string, vars?: YT.PlayerVars): string;

  /**
   * Test a URL to see if it points to a YouTube video.
   * @param url - The URL to test. (default: `""`)
   * @remarks `url` is optional because it has a default value, but since the empty string is not a valid YouTube URL,
   * calling this without passing a value does not seem useful.
   */
  isYouTubeURL(url?: string): boolean;

  #VideoHelper: true;
}

declare namespace VideoHelper {
  interface Any extends AnyVideoHelper {}
  interface AnyConstructor extends Identity<typeof AnyVideoHelper> {}

  type VIDEO_MIME_TYPES = ValueOf<typeof CONST.VIDEO_FILE_EXTENSIONS>;

  type _PlayOptions = InexactPartial<{
    /**
     * Should the video be playing? Otherwise, it will be paused
     * @defaultValue `true`
     */
    playing: boolean;

    /**
     * Should the video loop?
     * @defaultValue `true`
     */
    loop: boolean;

    /** A specific timestamp between 0 and the video duration to begin playback */
    offset: number;

    /**
     * Desired volume level of the video's audio channel (if any)
     * @remarks Should be between `0` and `1`
     */
    volume: number;
  }>;

  interface PlayOptions extends _PlayOptions {}
}

export default VideoHelper;

declare abstract class AnyVideoHelper extends VideoHelper {
  constructor(...args: never);
}
