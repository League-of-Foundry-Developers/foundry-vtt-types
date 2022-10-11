export {};

declare global {
  /**
   * The Camera UI View that displays all the camera feeds as individual video elements.
   * @typeParam Options - the type of the options object
   */
  class CameraViews<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options: Options);

    /**
     * @defaultValue
     * ```typescript
     * return foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "camera-views",
     *   template: "templates/hud/camera-views.html",
     *   popOut: false,
     *   width: 240,
     *   resizable: {selector: ".camera-view-width-control, resizeY: false}
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    /**
     * A reference to the master AV orchestrator instance
     */
    get webrtc(): Game["webrtc"];

    /**
     * If all camera views are popped out, hide the dock.
     */
    get hidden(): boolean;

    /**
     * Obtain a reference to the div.camera-view which is used to portray a given Foundry User.
     * @param userId - The ID of the User document
     */
    getUserCameraView(userId: string): HTMLElement | null;

    /**
     * Obtain a reference to the video.user-camera which displays the video channel for a requested Foundry User.
     * If the user is not broadcasting video this will return null.
     * @param userId - The ID of the User document
     */
    getUserVideoElement(userId: string): HTMLVideoElement | null;

    /**
     * Sets whether a user is currently speaking or not
     *
     * @param userId   - The ID of the user
     * @param speaking - Whether the user is speaking
     */
    setUserIsSpeaking(userId: string, speaking: boolean): void;

    /**
     * Extend the render logic to first check whether a render is necessary based on the context
     * If a specific context was provided, make sure an update to the navigation is necessary before rendering
     */
    render(force?: boolean, context?: Application.RenderOptions<Options>): this | void;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override setPosition(
      position?: Partial<Omit<Application.Position, "zIndex">> | undefined
    ): void | (Application.Position & { height: number });

    override getData(options?: Partial<Options>): MaybePromise<object>;

    /** @defaultValue `undefined` */
    maxZ?: number;

    /**
     * Prepare rendering data for a single user
     * @internal
     */
    protected _getDataForUser(userId: string, settings: AVSettings.UserSettings): CameraViews.User | null;

    /**
     * A custom sorting function that orders/arranges the user display frames
     * @internal
     */
    protected static _sortUsers(a: CameraViews.User, b: CameraViews.User): number;

    override activateListeners(html: JQuery): void;

    /**
     * On hover in a camera container, show/hide the controls.
     * @param event - The original mouseover or mouseout hover event
     * @internal
     */
    protected _onCameraViewHover(event: JQuery.MouseEnterEvent | JQuery.MouseLeaveEvent): void;

    /**
     * On clicking on a toggle, disable/enable the audio or video stream.
     * @param event - The originating click event
     * @internal
     */
    protected _onClickControl(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Change volume control for a stream
     * @param event - The originating change event from interaction with the range input
     * @internal
     */
    protected _onVolumeChange(event: JQuery.ChangeEvent): void;

    /**
     * Dynamically refresh the state of a single camera view
     * @param userId - The ID of the user whose view we want to refresh.
     */
    protected _refreshView(userId: string): void;

    /**
     * Render changes needed to the PlayerList ui.
     * Show/Hide players depending on option.
     * @internal
     */
    protected _setPlayerListVisibility(): void;

    /**
     * Get the icon class that should be used for various action buttons with different toggled states.
     * The returned icon should represent the visual status of the NEXT state (not the CURRENT state).
     *
     * @param action - The named av-control button action
     * @param state  - The CURRENT action state.
     * @returns The icon that represents the NEXT action state.
     */
    protected _getToggleIcon(action: string, state: boolean): string | null;

    /**
     * Get the text title that should be used for various action buttons with different toggled states.
     * The returned title should represent the tooltip of the NEXT state (not the CURRENT state).
     *
     * @param action - The named av-control button action
     * @param state - The CURRENT action state.
     * @returns The icon that represents the NEXT action state.
     */
    protected _getToggleTooltip(action: string, state: boolean): string;

    /**
     * Show or hide UI control elements
     * This replaces the use of jquery.show/hide as it simply adds a class which has display:none
     * which allows us to have elements with display:flex which can be hidden then shown without
     * breaking their display style.
     * This will show/hide the toggle buttons, volume controls and overlay sidebars
     * @param container - The container for which to show/hide control elements
     * @param show      - Whether to show or hide the controls
     * @param selector  - Override selector to specify which controls to show or hide
     *                    (default: `".control-bar"`)
     * @internal
     */
    protected _toggleControlVisibility(container: HTMLElement, show: boolean, selector?: string): void;
  }

  namespace CameraViews {
    interface User {
      user: StoredDocument<globalThis.User>;
      settings: AVSettings.UserSettings;
      local: StoredDocument<globalThis.User>["isSelf"];
      charname: string;
      volume: number;
      cameraViewClass: string;
    }
  }
}
