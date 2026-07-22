import type { DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AmbientLightConfig from "../ambient-light-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientLightPalette: AmbientLightPalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created ambient lights.
 */
declare class AmbientLightPalette<
  RenderContext extends AmbientLightPalette.RenderContext = AmbientLightPalette.RenderContext,
  Configuration extends AmbientLightPalette.Configuration = AmbientLightPalette.Configuration,
  RenderOptions extends AmbientLightPalette.RenderOptions = AmbientLightPalette.RenderOptions,
> extends PlaceablePaletteMixin(AmbientLightConfig)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "ambient-light-palette"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: AmbientLightPalette.DefaultOptions;

  /** @defaultValue `"ambientLightPalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"AmbientLight"` */
  static override documentName: string;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/ambient-light/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override get schema(): fields.SchemaField.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #AmbientLightPalette: true;
}

declare namespace AmbientLightPalette {
  interface Any extends AnyAmbientLightPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightPalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode AmbientLightConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration
    extends AmbientLightConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `AmbientLightPalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends AmbientLightConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  // Note(LukeAbby): `isDarkness`/`colorationTechniques`/`lightAnimations` are already required fields of
  // {@linkcode AmbientLightConfig.RenderContext}, prepared before `AmbientLightPalette`'s own additions via
  // `super._prepareContext(options)`, so they don't need to be re-declared here.
  interface RenderContext extends AmbientLightConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}
}

declare abstract class AnyAmbientLightPalette extends AmbientLightPalette<
  AmbientLightPalette.RenderContext,
  AmbientLightPalette.Configuration,
  AmbientLightPalette.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightPalette;
