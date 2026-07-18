import type { DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type WallConfig from "../wall-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

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
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "wall-palette",
   *   initialData: { c: [0, 0, 0, 0] }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: WallPalette.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/wall/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** @defaultValue `"wallPalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"wall"` */
  static override COMMIT_TOOL: string | undefined;

  /** @defaultValue `"Wall"` */
  static override documentName: string;

  static override get schema(): fields.SchemaField.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Handle clicking a preset button in the scene controls.
   * @param event -
   */
  static onClickPreset(event: PointerEvent): void;

  #WallPalette: true;
}

declare namespace WallPalette {
  interface Any extends AnyWallPalette {}
  interface AnyConstructor extends Identity<typeof AnyWallPalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode WallConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration extends WallConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `WallPalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends WallConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  /**
   * @remarks `coordinates` is deleted from the context by {@linkcode WallPalette._prepareContext | #_prepareContext}
   * at runtime, but cannot be `Omit`ted here because the mixin's base class constraint requires the full
   * {@linkcode WallConfig.RenderContext}.
   */
  interface RenderContext extends WallConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}
}

declare abstract class AnyWallPalette extends WallPalette<
  WallPalette.RenderContext,
  WallPalette.Configuration,
  WallPalette.RenderOptions
> {
  constructor(...args: never);
}

export default WallPalette;
