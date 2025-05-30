import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ImagePopout: ImagePopout.Any;
    }
  }
}

/**
 * An Image Popout Application which features a single image in a lightbox style frame.
 * Furthermore, this application allows for sharing the display of an image with other connected players.
 *
 * @example Creating an Image Popout
 * ```js
 * // Construct the Application instance
 * const ip = new ImagePopout({
 *   src: "path/to/image.jpg",
 *   uuid: game.actors.getName("My Hero").uuid
 *   window: {title: "My Featured Image"}
 * });
 *
 * // Display the image popout
 * ip.render(true);
 *
 * // Share the image with other connected players
 * ip.shareImage();
 * ```
 * @remarks TODO: Stub
 */
declare class ImagePopout<
  RenderContext extends ImagePopout.RenderContext = ImagePopout.RenderContext,
  Configuration extends ImagePopout.Configuration = ImagePopout.Configuration,
  RenderOptions extends ImagePopout.RenderOptions = ImagePopout.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: DeepPartial<Configuration> & { src: string });
}

declare namespace ImagePopout {
  interface Any extends AnyImagePopout {}
  interface AnyConstructor extends Identity<typeof AnyImagePopout> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    caption: string | undefined;
    image: string;
    isVideo: boolean;
    title: string;
    altText: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {
    /** The URL to the image or video file */
    src: string;

    /** Caption text to display below the image. */
    caption: string;

    /**
     * The UUID of some related {@link foundry.abstract.Document|`Document`}.
     * @defaultValue `null`
     */
    uuid: string | null | undefined;

    /** Force showing or hiding the title */
    showTitle?: boolean | null | undefined;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyImagePopout extends ImagePopout<
  ImagePopout.RenderContext,
  ImagePopout.Configuration,
  ImagePopout.RenderOptions
> {}

export default ImagePopout;
