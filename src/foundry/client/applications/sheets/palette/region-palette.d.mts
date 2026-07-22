import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type RegionConfig from "../region-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionPalette: RegionPalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created regions.
 */
declare class RegionPalette<
  RenderContext extends RegionPalette.RenderContext = RegionPalette.RenderContext,
  Configuration extends RegionPalette.Configuration = RegionPalette.Configuration,
  RenderOptions extends RegionPalette.RenderOptions = RegionPalette.RenderOptions,
> extends PlaceablePaletteMixin(RegionConfig)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "region-palette",
   *   initialData: {
   *     name: "regionPalette",
   *     ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER }
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: RegionPalette.DefaultOptions;

  /** @defaultValue `"regionPalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"Region"` */
  static override documentName: string;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/region/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   levels: [canvas.level.id],
   *   elevation: {
   *     bottom: Number.isFinite(canvas.level.elevation.bottom) ? canvas.level.elevation.bottom : null,
   *     top: Number.isFinite(canvas.level.elevation.top) ? canvas.level.elevation.top : null
   *   }
   * }
   * ```
   */
  protected static override _getDefaultLevelData(): AnyObject;

  static override get schema(): fields.SchemaField.Any;

  /**
   * @remarks Foundry's implementation computes `preset` (merging in `formData.elevation`) but never returns it,
   * unlike every other override of this method — this appears to be a bug, but the return type here matches the
   * base class's for override compatibility.
   */
  protected override _applyPreset(formData: AnyObject, options?: DeepPartial<RenderOptions>): AnyObject;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: AnyObject,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<RegionDocument.Implementation>>;

  #RegionPalette: true;
}

declare namespace RegionPalette {
  interface Any extends AnyRegionPalette {}
  interface AnyConstructor extends Identity<typeof AnyRegionPalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode RegionConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration extends RegionConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `RegionPalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends RegionConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  // Note(LukeAbby): `visibilities`/`restrictionTypes` are already fields of
  // {@linkcode RegionConfig.RenderContext}; only `color` is genuinely new here. The config's optional `buttons`
  // is omitted because {@linkcode PlaceablePaletteMixin.RenderContext} declares it as required, which is what
  // the runtime intersection resolves to.
  interface RenderContext extends Omit<RegionConfig.RenderContext, "buttons">, PlaceablePaletteMixin.RenderContext {
    /**
     * @remarks Added by {@linkcode RegionPalette._prepareContext | #_prepareContext} (as `context.source.color`).
     * A `string` rather than a {@linkcode Color} because it comes from the document's raw `_source`, where the
     * palette's injected, nullable `color` field is stored in its persisted `string` form rather than as an
     * initialized `Color`.
     */
    color: string | null;
  }
}

declare abstract class AnyRegionPalette extends RegionPalette<
  RegionPalette.RenderContext,
  RegionPalette.Configuration,
  RegionPalette.RenderOptions
> {
  constructor(...args: never);
}

export default RegionPalette;
