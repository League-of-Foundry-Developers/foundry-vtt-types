import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
 * @remarks TODO: Stub
 */
declare class CardConfig<
  RenderContext extends CardConfig.RenderContext = CardConfig.RenderContext,
  Configuration extends CardConfig.Configuration = CardConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Card.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace CardConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Card.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Card.Implementation> {}
}

export default CardConfig;
