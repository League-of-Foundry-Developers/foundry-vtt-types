import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AmbientSoundConfig from "../ambient-sound-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientSoundPalette: AmbientSoundPalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created ambient sounds.
 */
declare class AmbientSoundPalette<
  RenderContext extends AmbientSoundPalette.RenderContext = AmbientSoundPalette.RenderContext,
  Configuration extends AmbientSoundPalette.Configuration = AmbientSoundPalette.Configuration,
  RenderOptions extends AmbientSoundPalette.RenderOptions = AmbientSoundPalette.RenderOptions,
> extends PlaceablePaletteMixin(AmbientSoundConfig)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "ambient-sound-palette"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: AmbientSoundPalette.DefaultOptions;

  /** @defaultValue `"ambientSoundPalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"AmbientSound"` */
  static override documentName: string;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/ambient-sound/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get createData(): AnyObject;

  static override get schema(): fields.SchemaField.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  #AmbientSoundPalette: true;
}

declare namespace AmbientSoundPalette {
  interface Any extends AnyAmbientSoundPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundPalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode AmbientSoundConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration
    extends AmbientSoundConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `AmbientSoundPalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends AmbientSoundConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  interface RenderContext extends AmbientSoundConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}
}

declare abstract class AnyAmbientSoundPalette extends AmbientSoundPalette<
  AmbientSoundPalette.RenderContext,
  AmbientSoundPalette.Configuration,
  AmbientSoundPalette.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientSoundPalette;
