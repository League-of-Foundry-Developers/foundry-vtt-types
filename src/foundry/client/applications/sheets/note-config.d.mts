import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      NoteConfig: NoteConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Note document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class NoteConfig<
  RenderContext extends NoteConfig.RenderContext = NoteConfig.RenderContext,
  Configuration extends NoteConfig.Configuration = NoteConfig.Configuration,
  RenderOptions extends NoteConfig.RenderOptions = NoteConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  NoteDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace NoteConfig {
  interface Any extends AnyNoteConfig {}
  interface AnyConstructor extends Identity<typeof AnyNoteConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<NoteDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<NoteDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyNoteConfig extends NoteConfig<
  NoteConfig.RenderContext,
  NoteConfig.Configuration,
  NoteConfig.RenderOptions
> {
  constructor(...args: never);
}

export default NoteConfig;
