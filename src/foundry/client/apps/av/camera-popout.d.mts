export {};

declare global {
  /**
   * Abstraction of the Application interface to be used with the Draggable class as a substitute for the app
   * This class will represent one popout feed window and handle its positioning and draggability
   */
  class CameraPopoutAppWrapper {
    /**
     * @param view    - The CameraViews application that this popout belongs to
     * @param userId  - ID of the user this popout belongs to
     * @param element - The div element of this specific popout window
     */
    constructor(view: CameraViews, userId: string, element: JQuery);

    /**
     * The CameraViews application that this popout belongs to
     */
    view: CameraViews;

    /**
     * The div element of this specific popout window
     */
    element: JQuery;

    /**
     * ID of the user this popout belongs to
     */
    userId: string;

    /** @defaultValue `true` */
    popOut: boolean;

    /** @defaultValue `{}` */
    options: Record<string, unknown>;

    /**
     * Get the current position of this popout window
     */
    get position(): Application.Position;

    setPosition(options?: Partial<Application.Position>): (Application.Position & { height: number }) | void;

    /** @internal */
    protected _onResize(event: Event): void;

    bringToTop(): void;
  }
}
