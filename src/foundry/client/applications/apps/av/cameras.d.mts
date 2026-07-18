import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type { NumberField } from "#common/data/fields.d.mts";
import type CameraPopout from "./camera-popout.d.mts";

import AVSettings = foundry.av.AVSettings;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CameraViews: CameraViews.Any;
    }
  }
}

/**
 * An application that shows docked camera views.
 */
declare class CameraViews<
  RenderContext extends CameraViews.RenderContext = CameraViews.RenderContext,
  Configuration extends CameraViews.Configuration = CameraViews.Configuration,
  RenderOptions extends CameraViews.RenderOptions = CameraViews.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "camera-views",
   *   window: {
   *     frame: false
   *   },
   *   actions: {
   *     blockAudio: this.prototype._onBlockAudio,
   *     blockVideo: this.prototype._onBlockVideo,
   *     configure: this.prototype._onConfigure,
   *     disableVideo: this.prototype._onDisableVideo,
   *     hide: this.prototype._onHideUser,
   *     mutePeers: this.prototype._onMutePeers,
   *     toggleAudio: this.prototype._onToggleAudio,
   *     toggleDock: CameraViews.#onToggleDock,
   *     toggleDocked: CameraViews.#onToggleDocked,
   *     toggleVideo: this.prototype._onToggleVideo
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CameraViews.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   cameras: {
   *     template: "templates/apps/av/cameras.hbs",
   *     scrollable: [".scrollable"]
   *   },
   *   controls: {
   *     template: "templates/apps/av/controls.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Icons for the docked state of the camera dock.
   * @defaultValue
   * ```js
   * {
   *   [AVSettings.DOCK_POSITIONS.TOP]: ["up", "down"],
   *   [AVSettings.DOCK_POSITIONS.RIGHT]: ["right", "left"],
   *   [AVSettings.DOCK_POSITIONS.BOTTOM]: ["down", "up"],
   *   [AVSettings.DOCK_POSITIONS.LEFT]: ["left", "right"]
   * }
   * ```
   */
  DOCK_ICONS: Record<AVSettings.DOCK_POSITIONS, [string, string]>;

  /**
   * If all camera views are popped out, hide the dock.
   */
  get hidden(): boolean;

  /**
   * Whether the AV dock is in a horizontal configuration.
   */
  get isHorizontal(): boolean;

  /**
   * Whether the AV dock is in a vertical configuration.
   */
  get isVertical(): boolean;

  /**
   * Cameras which have been popped-out of this dock.
   * @remarks Reads from the {@linkcode foundry.applications.instances} registry, which is only known to contain
   * {@linkcode CameraPopout} instances for the `camera-view-` prefixed ids being queried for.
   */
  get popouts(): CameraPopout.Any[];

  /**
   * The cached list of processed user entries.
   */
  get users(): Record<string, CameraViews.UserContext>;

  /**
   * Get a user's camera dock.
   * @param userId - The user's ID.
   */
  getUserCameraView(userId: string): HTMLElement | null;

  /**
   * Get the video element for a user broadcasting video.
   * @param userId - The user's ID.
   */
  getUserVideoElement(userId: string): HTMLVideoElement | null;

  /**
   * Indicate a user is speaking on their camera dock.
   * @param userId   - The user's ID.
   * @param speaking - Whether the user is speaking.
   */
  setUserIsSpeaking(userId: string, speaking: boolean): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for controls.
   */
  protected _prepareControlsContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the given user.
   * @param id - The user's ID.
   */
  _prepareUserContext(id: string): CameraViews.UserContext | void;

  protected override _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<RenderOptions>,
  ): void;

  protected override _attachFrameListeners(): void;

  /**
   * Handle blocking a user's audio stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onBlockAudio(event: PointerEvent, target: HTMLElement): Promise<this | void>;

  /**
   * Handle blocking a user's video stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onBlockVideo(event: PointerEvent, target: HTMLElement): Promise<this | void>;

  /**
   * Handle spawning the AV configuration dialog.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onConfigure(event: PointerEvent, target: HTMLElement): Promise<foundry.applications.settings.menus.AVConfig>;

  /**
   * Handle disabling all incoming video streams.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onDisableVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle hiding a user from the AV UI entirely.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onHideUser(event: PointerEvent, target: HTMLElement): Promise<this | void>;

  /**
   * Handle disabling all incoming audio streams.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onMutePeers(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle the user toggling their own audio stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onToggleAudio(
    event: PointerEvent,
    target: HTMLElement,
  ): Promise<this | foundry.applications.ui.Notifications.Notification<"warning"> | void>;

  /**
   * Handle the user toggling their own video stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  _onToggleVideo(
    event: PointerEvent,
    target: HTMLElement,
  ): Promise<this | foundry.applications.ui.Notifications.Notification<"warning"> | void>;

  /**
   * Handle changing another user's volume.
   * @param event - The triggering event.
   * @remarks Assumes `event.target` is an {@linkcode Element} within a `[data-user]` container containing a
   * `range-picker` element, neither of which is guaranteed by the `Event` type.
   */
  protected _onVolumeChange(event: Event): void;

  /**
   * Sort users' cameras in the dock.
   */
  protected static _sortUsers(a: CameraViews.UserContext, b: CameraViews.UserContext): number;

  #CameraViews: true;
}

declare namespace CameraViews {
  interface Any extends AnyCameraViews {}
  interface AnyConstructor extends Identity<typeof AnyCameraViews> {}

  /**
   * @remarks For a connected user's own part context, {@linkcode UserContext}'s fields (including `user`, the
   * {@linkcode User} instance) are merged in directly by
   * {@linkcode CameraViews._preparePartContext | #_preparePartContext}. For the `controls` part context, `user` is
   * instead the current user's whole {@linkcode UserContext}, set by
   * {@linkcode CameraViews._prepareControlsContext | #_prepareControlsContext}.
   */
  type RenderContext = HandlebarsApplicationMixin.RenderContext &
    ApplicationV2.RenderContext &
    Partial<Omit<UserContext, "user">> & {
      user?: User.Stored | UserContext | undefined;
    };

  interface Configuration<CameraViews extends CameraViews.Any = CameraViews.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraViews> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraViews extends CameraViews.Any = CameraViews.Any> = DeepPartial<Configuration<CameraViews>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface ControlContext {
    icon: string;
    label: string;
    display: boolean;
  }

  interface UserContext {
    /** The User instance. */
    user: User.Stored;

    /** The user's AV settings. */
    settings: AVSettings.UserSettings;

    /** Whether the user's AV stream is local. */
    local: boolean;

    /** The user's character name. */
    charname: string;

    /** The CSS class of the user's camera dock. */
    css: string;

    /** Whether the user is broadcasting video. */
    hasVideo: boolean;

    /** Whether the user is broadcasting audio. */
    hasAudio: boolean;

    /** Whether the main camera dock is hidden. */
    hidden: boolean;

    nameplates: Nameplates;

    video: Video;

    volume: Volume;

    controls: Record<string, ControlContext>;
  }

  interface Nameplates {
    /** Whether camera nameplates are entirely hidden. */
    hidden: boolean;

    /** Nameplate CSS classes. */
    css: string;

    /** Whether to show player names on nameplates. */
    playerName: boolean;

    /** Whether to show character names on nameplates. */
    charname: boolean;
  }

  interface Video {
    /** The video stream's volume. */
    volume: number;

    /** Whether to mute the video stream's audio. */
    muted: boolean;

    /** Whether to show this user's camera. */
    show: boolean;
  }

  interface Volume {
    /** The user's configured volume level. */
    value: number;

    /** The volume range field. */
    field: NumberField;

    /** The field's ARIA attributes. */
    aria: { label: string };

    /** Whether to show a volume bar for this user. */
    show: boolean;
  }
}

declare abstract class AnyCameraViews extends CameraViews<
  CameraViews.RenderContext,
  CameraViews.Configuration,
  CameraViews.RenderOptions
> {
  constructor(...args: never);
}

export default CameraViews;
