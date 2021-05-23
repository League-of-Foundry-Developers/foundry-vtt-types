/**
 * Abstraction of the Application interface to be used with the Draggable class as a substitute for the app
 * This class will represent one popout feed window and handle its positioning and draggability
 */
declare class CameraPopoutAppWrapper {
  /**
   * @param view- The CameraViews application that this popout belongs to
   * @param userId- ID of the user this popout belongs to
   * @param element- The div element of this specific popout window
   */
  constructor(view: CameraViews, userId: string, element: JQuery);

  /**
   * The div element of this specific popout window
   */
  element: JQuery;

  /**
   * ID of the user this popout belongs to
   */
  userId: string;

  /**
   * The CameraViews application that this popout belongs to
   */
  view: CameraViews;

  /**
   * Get the current position of this popout window
   */
  get position(): Application.Position;

  /** @override */
  bringToTop(): void;

  /** @override */
  setPosition({ left, top, width, height, scale }?: Partial<Application.Position>): void;

  private _onResize(event: Event): void;
}
