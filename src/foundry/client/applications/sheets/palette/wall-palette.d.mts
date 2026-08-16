import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type WallConfig from "../wall-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallPalette: WallPalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created walls.
 */
declare class WallPalette<
  RenderContext extends WallPalette.RenderContext = WallPalette.RenderContext,
  Configuration extends WallPalette.Configuration = WallPalette.Configuration,
  RenderOptions extends WallPalette.RenderOptions = WallPalette.RenderOptions,
> extends PlaceablePaletteMixin(WallConfig)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"wallPalette"`
   */
  static SETTING_KEY: string;

  /**
   * @remarks Narrowed from the mixin's `string | undefined`: the wall palette is the only one that switches tools after
   * committing, so this is always defined here.
   *
   * @defaultValue `"wall"`
   */
  static override COMMIT_TOOL: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"Wall"`
   */
  static documentName: Document.PlaceableType;

  /**
   * @remarks Drops the `c` endpoint field, which is set per-Wall as it is drawn rather than as a palette default.
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): WallDocument.Implementation[];

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Handle clicking a preset button in the scene controls.
   */
  static onClickPreset(event: PointerEvent): void;
}

declare namespace WallPalette {
  interface Any extends AnyWallPalette {}
  interface AnyConstructor extends Identity<typeof AnyWallPalette> {}

  interface RenderContext extends WallConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}

  interface Configuration extends WallConfig.Configuration, PlaceablePaletteMixin._Configuration {}

  interface RenderOptions extends WallConfig.RenderOptions, PlaceablePaletteMixin._RenderOptions {}
}

declare abstract class AnyWallPalette extends WallPalette<
  WallPalette.RenderContext,
  WallPalette.Configuration,
  WallPalette.RenderOptions
> {
  constructor(...args: never);
}

export default WallPalette;
