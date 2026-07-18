import type { DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type NoteConfig from "../note-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

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
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "note-palette"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: NotePalette.DefaultOptions;

  /** @defaultValue `"notePalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"Note"` */
  static override documentName: string;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/note/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override get schema(): fields.SchemaField.Any;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _determineMultiFields(docs: Document.Any[]): Set<string>;

  #NotePalette: true;
}

declare namespace NotePalette {
  interface Any extends AnyNotePalette {}
  interface AnyConstructor extends Identity<typeof AnyNotePalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode NoteConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration extends NoteConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `NotePalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends NoteConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  interface RenderContext extends NoteConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}
}

declare abstract class AnyNotePalette extends NotePalette<
  NotePalette.RenderContext,
  NotePalette.Configuration,
  NotePalette.RenderOptions
> {
  constructor(...args: never);
}

export default NotePalette;
