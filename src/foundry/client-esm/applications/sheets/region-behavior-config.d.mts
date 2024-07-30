import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Region configuration application.
 */
export default class RegionBehaviorConfig<
  Document extends foundry.abstract.Document<any, any, any>,
  Configuration extends DocumentSheetV2.Configuration<Document> = DocumentSheetV2.Configuration<Document>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
  RenderContext extends Record<string, unknown> = Record<string, never>,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, Configuration, RenderOptions, RenderContext> {}
