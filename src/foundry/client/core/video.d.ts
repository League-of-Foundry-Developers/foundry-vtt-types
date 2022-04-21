/**
 * A helper class to provide common functionality for working with HTML5 video objects
 * A singleton instance of this class is available as `game.video`
 */
declare class VideoHelper {
  constructor();

  /**
   * A user gesture must be registered before video playback can begin.
   * This Set records the video elements which await such a gesture.
   */
  pending: Set<HTMLVideoElement>;

  /**
   * A mapping of base64 video thumbnail images
   * @defaultValue an empty Map
   */
  thumbs: Map<string, string>;

  /**
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `true`
   */
  locked: boolean;

  static hasVideoExtension(src: string): boolean;

  /**
   * Play a single video source
   * If playback is not yet enabled, add the video to the pending queue
   * @param video - The VIDEO element to play
   */
  play(video: HTMLVideoElement): void;

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
   * Handle the first observed user gesture
   * We need a slight delay because unfortunately Chrome is stupid and doesn't always acknowledge the gesture fast enough.
   * @param event - The mouse-move event which enables playback
   * @internal
   */
  protected _onFirstGesture(event: Event): void;

  /**
   * Create and cache a static thumbnail to use for the video.
   * The thumbnail is cached using the video file path or URL.
   * @param src     - The source video URL
   * @param options - Thumbnail creation options, including width and height
   * @returns The created and cached base64 thumbnail image, or a placeholder image if the canvas is
   *          disabled and no thumbnail can be generated.
   */
  createThumbnail(src: string, options: ImageHelper.CompositeOptions): Promise<string>;
}
