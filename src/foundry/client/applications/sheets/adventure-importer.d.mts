import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * This Document Sheet is responsible for rendering an Adventure and providing an interface to import it.
 * @remarks TODO: Stub
 */
declare class AdventureImporter<
  RenderContext extends AdventureImporter.RenderContext = AdventureImporter.RenderContext,
  Configuration extends AdventureImporter.Configuration = AdventureImporter.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace AdventureImporter {
  interface RenderContext extends DocumentSheetV2.RenderContext<Adventure.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Adventure.Implementation> {}
}

export default AdventureImporter;
