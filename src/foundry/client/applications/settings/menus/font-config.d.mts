import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FontConfig: FontConfig.Any;
    }
  }
}

/**
 * A V2 application responsible for configuring custom fonts for the world.
 * @remarks TODO: Stub
 */
declare class FontConfig<
  RenderContext extends FontConfig.RenderContext = FontConfig.RenderContext,
  Configuration extends FontConfig.Configuration = FontConfig.Configuration,
  RenderOptions extends FontConfig.RenderOptions = FontConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: FontConfig.DefaultOptions;

  /** Font types */
  static FONT_TYPES: Readonly<{
    /** Font is a file */
    FILE: "file";

    /** Font is from the system */
    SYSTEM: "system";
  }>;
}

declare namespace FontConfig {
  interface Any extends AnyFontConfig {}
  interface AnyConstructor extends Identity<typeof AnyFontConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<FontConfig extends FontConfig.Any = FontConfig.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<FontConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FontConfig extends FontConfig.Any = FontConfig.Any> = DeepPartial<Configuration<FontConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface NewFontDefinition {
    family: string;

    /** @defaultValue `400` */
    weight?: number;

    /** @defaultValue `"normal"` */
    style?: string;

    /** @defaultValue `""` */
    src?: string;

    preview?: string;
  }

  interface RenderContext extends ApplicationV2.RenderContext {}
}

declare abstract class AnyFontConfig extends FontConfig<
  FontConfig.RenderContext,
  FontConfig.Configuration,
  FontConfig.RenderOptions
> {
  constructor(...args: never);
}

export default FontConfig;
