import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * An interface for packaging Adventure content and loading it to a compendium pack.
 * @remarks TODO: Stub
 */
declare class AdventureExporter<
  RenderContext extends AdventureExporter.RenderContext = AdventureExporter.RenderContext,
  Configuration extends AdventureExporter.Configuration = AdventureExporter.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace AdventureExporter {
  interface RenderContext extends DocumentSheetV2.RenderContext<Adventure.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Adventure.Implementation> {}
}

export default AdventureExporter;
