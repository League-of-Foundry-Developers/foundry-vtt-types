import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A V2 application responsible for configuring custom fonts for the world.
 * @remarks TODO: Stub
 */
declare class FontConfig<
  RenderContext extends FontConfig.RenderContext = FontConfig.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /** Font types */
  static FONT_TYPES: Readonly<{
    /** Font is a file */
    FILE: "file";

    /** Font is from the system */
    SYSTEM: "system";
  }>;
}

declare namespace FontConfig {
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

export default FontConfig;
