/**
 * A helper class to provide common functionality for working with HTML5 video
 * objects
 * A singleton instance of this class is available as `game.video`
 */
declare class VideoHelper {
  /**
   * A flag for whether video playback is currently locked by awaiting a user
   * gesture
   */
  locked: boolean

  /**
   * A user gesture must be registered before video playback can begin.
   * This Set records the video elements which await such a gesture.
   */
  pending: Set<HTMLVideoElement>

  /**
   * A mapping of base64 video thumbnail images
   */
  thumbs: Map<string, string>

  /**
   * A collectinon of HTML5 video objects which are currently active within the
   * FVTT page
   */
  videos: HTMLVideoElement[]

  constructor ();

  static hasVideoExtension (src: string): boolean;

  /**
   * Handle the first observed user gesture
   * We need a slight delay because unfortunately Chrome is stupid and doesn't
   * always acknowledge the gesture fast enough.
   * @param event - The mouse-move event which enables playback
   */
  _onFirstGesture (event: Event): void

  /**
   * Register an event listener to await the first mousemove gesture and begin
   * playback once observed
   * A user interaction must involve a mouse click or keypress.
   * Listen for any of these events, and handle the first observed gesture.
   */
  awaitFirstGesture (): void;

  /**
   * Create and cache a static thumbnail to use for the video.
   * The thumbnail is cached using the video file path or URL.
   * @param src - The source video URL
   * @param options - Thumbnail creation options, including width and height
   * @returns The created and cached base64 thumbnail image
   */
  createThumbnail (src: string, options: CompositeOptions): Promise<string>

  /**
   * Play a single video source
   * If playback is not yet enabled, add the video to the pending queue
   * @param video - The VIDEO element to play
   */
  play (video: HTMLElement): void;
}
