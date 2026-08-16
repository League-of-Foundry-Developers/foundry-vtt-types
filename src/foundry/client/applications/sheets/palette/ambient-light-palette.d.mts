import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AmbientLightConfig from "../ambient-light-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

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
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"ambientLightPalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"AmbientLight"`
   */
  static documentName: Document.PlaceableType;

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

  /**
   * @remarks Drops the positional, identifying, and locking fields, and replaces `config` with a
   * {@linkcode foundry.data.LightData} schema that excludes `dim` and `bright` — those two are configured per-light
   * rather than as a palette default.
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): AmbientLightDocument.Implementation[];

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace AmbientLightPalette {
  interface Any extends AnyAmbientLightPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightPalette> {}

  interface RenderContext extends AmbientLightConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;
  }

  interface Configuration extends AmbientLightConfig.Configuration, PlaceablePaletteMixin._Configuration {}

  interface RenderOptions extends AmbientLightConfig.RenderOptions, PlaceablePaletteMixin._RenderOptions {}
}

declare abstract class AnyAmbientLightPalette extends AmbientLightPalette<
  AmbientLightPalette.RenderContext,
  AmbientLightPalette.Configuration,
  AmbientLightPalette.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightPalette;
