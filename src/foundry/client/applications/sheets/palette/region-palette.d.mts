import type { AnyMutableObject, AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type RegionConfig from "../region-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

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
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"regionPalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"Region"`
   */
  static documentName: Document.PlaceableType;

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
   * @remarks Region elevation is a `bottom`/`top` pair rather than a single number, and each side is left `null` when
   * the viewed level's bound is infinite.
   */
  protected static override _getDefaultLevelData(): AnyMutableObject;

  /**
   * @remarks Drops the identity, shape, behavior, and ownership fields, and re-declares `color` as nullable so that a
   * blank value can mean "pick a random color per Region".
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): RegionDocument.Implementation[];

  /**
   * @remarks Merges the form's elevation over the preset's.
   *
   * @privateRemarks Returns `undefined` at runtime because the override does not return `preset`.
   */
  protected override _applyPreset(formData: AnyObject, options?: PlaceablePaletteMixin.RenderOptions): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;

  /**
   * @remarks A blank color means "no change" when applying to a selection, and "random color" when storing the
   * palette's own defaults.
   */
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<RegionDocument.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<RegionDocument.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<RegionDocument.Implementation>>;
}

declare namespace RegionPalette {
  interface Any extends AnyRegionPalette {}
  interface AnyConstructor extends Identity<typeof AnyRegionPalette> {}

  /**
   * @remarks `visibilities` and `restrictionTypes` are re-declared as required because the palette's own
   * `_prepareContext` sets them on every render, rather than only for the part that consumes them.
   */
  interface RenderContext extends RegionConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;

    visibilities: RegionConfig.VisibilityChoice[];

    restrictionTypes: RegionConfig.RestrictionTypeChoice[];

    /**
     * @remarks The source color, or `null` when the palette should assign a random color to each newly-created Region.
     */
    color: Color | null;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends RegionConfig.Configuration, PlaceablePaletteMixin._Configuration {}

  interface RenderOptions extends RegionConfig.RenderOptions, PlaceablePaletteMixin._RenderOptions {}
}

declare abstract class AnyRegionPalette extends RegionPalette<
  RegionPalette.RenderContext,
  RegionPalette.Configuration,
  RegionPalette.RenderOptions
> {
  constructor(...args: never);
}

export default RegionPalette;
