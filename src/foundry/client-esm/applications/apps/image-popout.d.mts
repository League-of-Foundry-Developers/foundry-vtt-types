import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

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
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace ImagePopout {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    src?: string;
    uuid: string | null;
  }
}

export default ImagePopout;
