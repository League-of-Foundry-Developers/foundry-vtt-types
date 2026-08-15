import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";
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
  static override DEFAULT_OPTIONS: CameraViews.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Icons for the docked state of the camera dock.
   * @remarks The tuple is `[expanded, minimized]` — indexed by whether `hideDock` is set.
   */
  DOCK_ICONS: Record<AVSettings.DOCK_POSITIONS, [expanded: string, minimized: string]>;

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

  protected override _canRender(options: DeepPartial<RenderOptions>): boolean;

  /** @remarks Adds one part per connected, unblocked user, keyed by user ID. */
  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for controls.
   * @remarks `options` is unused.
   */
  protected _prepareControlsContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the given user.
   * @param id - The user's ID.
   * @returns `undefined` if the user does not exist or is not active.
   * @internal
   */
  _prepareUserContext(id: string): CameraViews.UserContext | undefined;

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
   * @internal
   */
  _onBlockAudio(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle blocking a user's video stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onBlockVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle spawning the AV configuration dialog.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onConfigure(event: PointerEvent, target: HTMLElement): Promise<ApplicationV2.Any>;

  /**
   * Handle disabling all incoming video streams.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onDisableVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle hiding a user from the AV UI entirely.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onHideUser(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle disabling all incoming audio streams.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onMutePeers(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle the user toggling their own audio stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onToggleAudio(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle the user toggling their own video stream.
   * @param event  - The triggering event.
   * @param target - The action target.
   * @internal
   */
  _onToggleVideo(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle changing another user's volume.
   * @param event - The triggering event.
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

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<CameraViews extends CameraViews.Any = CameraViews.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraViews> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraViews extends CameraViews.Any = CameraViews.Any> = DeepPartial<Configuration<CameraViews>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  /** @remarks Added to the `controls` part's context by {@linkcode CameraViews._prepareControlsContext | #_prepareControlsContext}. */
  interface ControlsRenderContext extends RenderContext {
    /** @remarks The local user's entry; `undefined` if they are not among the connected, unblocked users. */
    user: UserContext | undefined;
  }

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

    /** @remarks Keyed by control name: `dock`, `video`, `audio`, `deafen`, `blind`, `blockVideo`, `blockAudio`, `hide`, `popout`. */
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
    /** The volume range field. */
    field: foundry.data.fields.NumberField;

    /** The user's configured volume level. */
    value: number;

    /** @remarks Accessibility attributes forwarded to the rendered range input. */
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
