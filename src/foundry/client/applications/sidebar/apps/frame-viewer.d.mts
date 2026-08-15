import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FrameViewer: FrameViewer.Any;
    }
  }
}

/**
 * A simple window application which shows the built documentation pages within an iframe
 */
declare class FrameViewer<
  RenderContext extends FrameViewer.RenderContext = FrameViewer.RenderContext,
  Configuration extends FrameViewer.Configuration = FrameViewer.Configuration,
  RenderOptions extends FrameViewer.RenderOptions = FrameViewer.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  /**
   * @deprecated since v13 until v15.
   * @remarks "FrameViewer has been deprecated with no replacement."
   */
  constructor(options?: DeepPartial<Configuration>);

  // Fake override.
  static override DEFAULT_OPTIONS: FrameViewer.DefaultOptions;

  /** @remarks Sizes the frame to 90% of the viewport, capped at 1200px wide, and centres it. */
  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Create the iframe and set its `src`.
   *
   * @privateRemarks Synchronous at runtime, and the only core `_renderHTML` that is. Kept as the base's
   * {@linkcode MaybePromise} so that an async override in a subclass still fits.
   */
  protected override _renderHTML(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): MaybePromise<HTMLIFrameElement>;

  protected override _replaceHTML(result: HTMLIFrameElement, content: HTMLElement): void;
}

declare namespace FrameViewer {
  interface Any extends AnyFrameViewer {}
  interface AnyConstructor extends Identity<typeof AnyFrameViewer> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<
    FrameViewer extends FrameViewer.Any = FrameViewer.Any,
  > extends ApplicationV2.Configuration<FrameViewer> {
    /**
     * The initial URL to navigate to
     *
     * @defaultValue `undefined`
     */
    url: string | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FrameViewer extends FrameViewer.Any = FrameViewer.Any> = DeepPartial<Configuration<FrameViewer>> &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyFrameViewer extends FrameViewer<
  FrameViewer.RenderContext,
  FrameViewer.Configuration,
  FrameViewer.RenderOptions
> {
  constructor(...args: never);
}

export default FrameViewer;
