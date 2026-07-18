import type { DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DrawingConfig from "../drawing-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingPalette: DrawingPalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created drawings.
 */
declare class DrawingPalette<
  RenderContext extends DrawingPalette.RenderContext = DrawingPalette.RenderContext,
  Configuration extends DrawingPalette.Configuration = DrawingPalette.Configuration,
  RenderOptions extends DrawingPalette.RenderOptions = DrawingPalette.RenderOptions,
> extends PlaceablePaletteMixin(DrawingConfig)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "drawing-palette",
   *   initialData: { shape: { type: "p", width: 1, height: 1, points: [0, 0, 1, 0] } }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DrawingPalette.DefaultOptions;

  /** @defaultValue `"drawingPalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"Drawing"` */
  static override documentName: string;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/drawing/body.hbs" },
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

  /**
   * Migrate existing default drawing settings into the palette.
   * @remarks Foundry marks this `@internal`; not otherwise referenced outside this class.
   */
  static _migrateDefaultDrawingConfig(): void;

  #DrawingPalette: true;
}

declare namespace DrawingPalette {
  interface Any extends AnyDrawingPalette {}
  interface AnyConstructor extends Identity<typeof AnyDrawingPalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode DrawingConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration extends DrawingConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `DrawingPalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends DrawingConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  // Note(LukeAbby): `scaledBezierFactor`/`fillDisabled`/`fillTypes`/`fontFamilies`/`drawingRoles` are already
  // fields of {@linkcode DrawingConfig.RenderContext}; only `isFreehand` is genuinely new here. The config's
  // optional `buttons` is omitted because {@linkcode PlaceablePaletteMixin.RenderContext} declares it as
  // required, which is what the runtime intersection resolves to.
  interface RenderContext extends Omit<DrawingConfig.RenderContext, "buttons">, PlaceablePaletteMixin.RenderContext {
    /** @remarks Added by {@linkcode DrawingPalette._prepareContext | #_prepareContext} */
    isFreehand: boolean;
  }
}

declare abstract class AnyDrawingPalette extends DrawingPalette<
  DrawingPalette.RenderContext,
  DrawingPalette.Configuration,
  DrawingPalette.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingPalette;
