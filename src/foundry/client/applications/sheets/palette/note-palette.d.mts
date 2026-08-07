import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type NoteConfig from "../note-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      NotePalette: NotePalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created notes.
 */
declare class NotePalette<
  RenderContext extends NotePalette.RenderContext = NotePalette.RenderContext,
  Configuration extends NotePalette.Configuration = NotePalette.Configuration,
  RenderOptions extends NotePalette.RenderOptions = NotePalette.RenderOptions,
> extends PlaceablePaletteMixin(NoteConfig)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"notePalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"Note"`
   */
  static documentName: Document.PlaceableType;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Drops the positional and journal-linking fields, which are set per-Note rather than as a palette default.
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): NoteDocument.Implementation[];

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * @remarks Also marks the `icon.selected` and `icon.custom` form fields as divergent whenever the underlying
   * `texture.src` is, since the icon picker is split across those two inputs.
   */
  protected override _determineMultiFields(docs: Document.Any[]): Set<string>;
}

declare namespace NotePalette {
  interface Any extends AnyNotePalette {}
  interface AnyConstructor extends Identity<typeof AnyNotePalette> {}

  interface RenderContext extends NoteConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;
  }

  interface Configuration extends NoteConfig.Configuration, PlaceablePaletteMixin.Configuration {}

  interface RenderOptions extends NoteConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}
}

declare abstract class AnyNotePalette extends NotePalette<
  NotePalette.RenderContext,
  NotePalette.Configuration,
  NotePalette.RenderOptions
> {
  constructor(...args: never);
}

export default NotePalette;
