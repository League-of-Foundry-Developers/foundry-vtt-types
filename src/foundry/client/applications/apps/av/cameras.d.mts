import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

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
 * @remarks TODO: Stub
 */
declare class CameraViews<
  RenderContext extends CameraViews.RenderContext = CameraViews.RenderContext,
  Configuration extends CameraViews.Configuration = CameraViews.Configuration,
  RenderOptions extends CameraViews.RenderOptions = CameraViews.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: CameraViews.DefaultOptions;
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

  interface ControlContext {
    icon: string;
    label: string;
    display: boolean;
  }

  interface UserContext {
    /** The User instance. */
    user: User.Implementation;

    /** The user's AV settings. */
    settings: AVSettings.Data;

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
    playerName: string;

    /** Whether to show character names on nameplates. */
    charname: string;
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
    field: foundry.data.fields.DataField.Any;

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
