import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Note document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class NoteConfig<
  RenderContext extends NoteConfig.RenderContext = NoteConfig.RenderContext,
  Configuration extends NoteConfig.Configuration = NoteConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  NoteDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace NoteConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<NoteDocument.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<NoteDocument.ConfiguredInstance> {}
}

export default NoteConfig;
