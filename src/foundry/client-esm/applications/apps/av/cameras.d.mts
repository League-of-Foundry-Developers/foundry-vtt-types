import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * An application that shows docked camera views.
 * @remarks TODO: Stub
 */
declare class CameraViews<
  RenderContext extends CameraViews.RenderContext = CameraViews.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CameraViews {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface ControlContext {
    icon: string;
    label: string;
    display: boolean;
  }

  interface UserContext {
    /** The User instance. */
    user: User;

    /** The user's AV settings. */
    settings: AVSettingsData;

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

export default CameraViews;
