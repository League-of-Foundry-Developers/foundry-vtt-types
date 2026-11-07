import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * An application finalizing a server shutdown.
 */
declare class ShuttingDown<
  RenderContext extends ShuttingDown.RenderContext = ShuttingDown.RenderContext,
  Configuration extends ShuttingDown.Configuration = ShuttingDown.Configuration,
  RenderOptions extends ShuttingDown.RenderOptions = ShuttingDown.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "shutting-down",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   },
   *   actions: {
   *     goBack: ShuttingDown.#onGoBack
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ShuttingDown.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   main: {
   *     id: "shutting-down",
   *     template: "templates/setup/shutting-down.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  static #ShuttingDown: true;
}

declare namespace ShuttingDown {
  interface Any extends AnyShuttingDown {}
  interface AnyConstructor extends Identity<typeof AnyShuttingDown> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<ShuttingDown extends ShuttingDown.Any = ShuttingDown.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<ShuttingDown> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ShuttingDown extends ShuttingDown.Any = ShuttingDown.Any> = DeepPartial<
    Configuration<ShuttingDown>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyShuttingDown extends ShuttingDown<
  ShuttingDown.RenderContext,
  ShuttingDown.Configuration,
  ShuttingDown.RenderOptions
> {
  constructor(...args: never);
}

export default ShuttingDown;
