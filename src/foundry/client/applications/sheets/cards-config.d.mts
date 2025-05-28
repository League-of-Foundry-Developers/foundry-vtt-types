import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A DocumentSheet application responsible for displaying and editing a single Cards stack.
 * @remarks TODO: Stub, add generic for the type.
 */
declare class CardsConfig<
  RenderContext extends CardsConfig.RenderContext = CardsConfig.RenderContext,
  Configuration extends
    DocumentSheetV2.Configuration<Cards.Implementation> = DocumentSheetV2.Configuration<Cards.Implementation>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Cards.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace CardsConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext {}
}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "deck" type.
 * @remarks TODO: Stub
 */
declare class CardDeckConfig extends CardsConfig {}

declare namespace CardDeckConfig {}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "hand" type.
 * @remarks TODO: Stub
 */
declare class CardHandConfig extends CardsConfig {}

declare namespace CardHandConfig {}

/**
 * A subclass of CardsConfig providing a sheet representation for Cards documents with the "pile" type.
 * @remarks TODO: Stub
 */
declare class CardPileConfig extends CardsConfig {}

declare namespace CardPileConfig {}

export { CardsConfig, CardDeckConfig, CardHandConfig, CardPileConfig };
