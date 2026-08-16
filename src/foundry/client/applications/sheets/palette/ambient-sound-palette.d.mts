import type { AnyMutableObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AmbientSoundConfig from "../ambient-sound-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

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
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"ambientSoundPalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"AmbientSound"`
   */
  static documentName: Document.PlaceableType;

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

  /**
   * @remarks Reads the live form values once rendered, so that changes made with the select tool active are picked up;
   * otherwise falls back to the stored setting.
   */
  override get createData(): AnyMutableObject;

  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): AmbientSoundDocument.Implementation[];

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;
}

declare namespace AmbientSoundPalette {
  interface Any extends AnyAmbientSoundPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundPalette> {}

  interface RenderContext extends AmbientSoundConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;
  }

  interface Configuration extends AmbientSoundConfig.Configuration, PlaceablePaletteMixin._Configuration {}

  interface RenderOptions extends AmbientSoundConfig.RenderOptions, PlaceablePaletteMixin._RenderOptions {}
}

declare abstract class AnyAmbientSoundPalette extends AmbientSoundPalette<
  AmbientSoundPalette.RenderContext,
  AmbientSoundPalette.Configuration,
  AmbientSoundPalette.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientSoundPalette;
