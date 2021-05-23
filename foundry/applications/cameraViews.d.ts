/**
 * The Camera UI View that displays all the camera feeds as individual video elements.
 * @typeParam P - the type of the options object
 */
declare class CameraViews<P extends Application.Options = Application.Options> extends Application<P> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "camera-views",
   *   template: "templates/hud/camera-views.html",
   *   popOut: false
   * });
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * A custom sorting function that orders/arranges the user display frames
   */
  protected static _sortUsers(a: CameraViews.Data.User, b: CameraViews.Data.User): number;

  /**
   * @param webrtc - The WebRTC Implementation to display
   *                 (unused)
   */
  constructor(webrtc?: any, options?: Partial<P>);

  maxZ: number;

  /**
   * A reference to the master AV orchestrator instance
   */
  get webrtc(): Game['webrtc'];

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): CameraViews.Data;

  /**
   * Obtain a reference to the div.camera-view which is used to portray a given Foundry User.
   * @param userId - The ID of the User entity
   */
  getUserCameraView(userId: string): HTMLElement | null;

  /**
   * Obtain a reference to the video.user-camera which displays the video channel for a requested Foundry User.
   * If the user is not broadcasting video this will return null.
   * @param userId - The ID of the User entity
   */
  getUserVideoElement(userId: string): HTMLVideoElement | null;

  /**
   * Extend the render logic to first check whether a render is necessary based on the context
   * If a specific context was provided, make sure an update to the navigation is necessary before rendering
   */
  render(force?: boolean, context?: Application.RenderOptions): Application['render'];

  /**
   * Sets whether a user is currently speaking or not
   *
   * @param userId   - The ID of the user
   * @param speaking - Whether the user is speaking
   */
  setUserIsSpeaking(userId: string, speaking: boolean): void;

  /**
   * Prepare rendering data for a single user
   */
  protected _getDataForUser(userId: string, settings: AVSettings.UserSettings): CameraViews.Data.User | null;

  /**
   * Get the icon class that should be used for various action buttons with different toggled states.
   * The returned icon should represent the visual status of the NEXT state (not the CURRENT state).
   *
   * @param action - The named av-control button action
   * @param state  - The CURRENT action state.
   * @returns The icon that represents the NEXT action state.
   */
  protected _getToggleIcon(action: string, state?: boolean): null;

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
   * On hover in a camera container, show/hide the controls.
   * @param event - The original mouseover or mouseout hover event
   */
  protected _onCameraViewHover(event: JQuery.MouseEnterEvent | JQuery.MouseLeaveEvent): void;

  /**
   * On clicking on a toggle, disable/enable the audio or video stream.
   * @param event - The originating click event
   */
  protected _onClickControl(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Change volume control for a stream
   * @param event - The originating change event from interaction with the range input
   */
  protected _onVolumeChange(event: JQuery.ChangeEvent): void;

  /**
   * Dynamically refresh the state of a single camera view
   * @param view - The view container div
   */
  protected _refreshView(view: HTMLElement): void;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * Render changes needed to the PlayerList ui.
   * Show/Hide players depending on option.
   */
  protected _setPlayerListVisibility(): void;

  /**
   * Show or hide UI control elements
   * This replaces the use of jquery.show/hide as it simply adds a class which has display:none
   * which allows us to have elements with display:flex which can be hidden then shown without
   * breaking their display style.
   * This will show/hide the toggle buttons, volume controls and overlay sidebars
   * @param container - The container for which to show/hide control elements
   * @param show      - Whether to show or hide the controls
   * @param selector  - Override selector to specify which controls to show or hide
   *                    (default: `'.control-bar'`)
   */
  protected _toggleControlVisibility(container: HTMLElement, show: boolean, selector?: string): void;
}

declare namespace CameraViews {
  interface Data {
    dockClass: string;
    muteAll: boolean;
    self: Game['user'];
    users: CameraViews.Data.User[];
  }

  namespace Data {
    interface User {
      avatar: globalThis.User['avatar'];
      cameraViewClass: ReturnType<Array<string>['filterJoin']>;
      charname: string;
      color: globalThis.User['data']['color'];
      colorAlpha: ReturnType<typeof hexToRGBAString>;
      id: globalThis.User['id'];
      local: globalThis.User['isSelf'];
      name: globalThis.User['name'];
      settings: AVSettings.UserSettings;
      user: globalThis.User;
      volume: ReturnType<typeof AudioHelper['volumeToInput']>;
    }
  }
}
