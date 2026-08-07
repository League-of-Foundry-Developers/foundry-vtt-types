import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DrawingConfig from "../drawing-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

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
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"drawingPalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"Drawing"`
   */
  static documentName: Document.PlaceableType;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Built from `DrawingDocument.defaultDrawingFields` rather than by pruning the full schema, with
   * `bezierFactor`'s initial value raised to `0.5`.
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): DrawingDocument.Implementation[];

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;

  /**
   * Migrate existing default drawing settings into the palette.
   * @internal
   */
  static _migrateDefaultDrawingConfig(): void;
}

declare namespace DrawingPalette {
  interface Any extends AnyDrawingPalette {}
  interface AnyConstructor extends Identity<typeof AnyDrawingPalette> {}

  /**
   * @remarks The members `DrawingConfig` only sets for the one part that consumes them are re-declared as required
   * here, because the palette's own `_prepareContext` sets them on every render.
   */
  interface RenderContext extends DrawingConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;

    /** @remarks Whether the freehand tool is the active drawing tool. */
    isFreehand: boolean;

    scaledBezierFactor: number;

    fillDisabled: boolean;

    fillTypes: DrawingConfig.FillTypeChoice[];

    fontFamilies: Record<string, string>;

    drawingRoles: Record<"false" | "true", string>;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends DrawingConfig.Configuration, PlaceablePaletteMixin.Configuration {}

  interface RenderOptions extends DrawingConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}
}

declare abstract class AnyDrawingPalette extends DrawingPalette<
  DrawingPalette.RenderContext,
  DrawingPalette.Configuration,
  DrawingPalette.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingPalette;
