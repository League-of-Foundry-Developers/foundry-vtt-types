import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardsConfig: CardsConfig.Any;
      CardDeckConfig: CardDeckConfig.Any;
      CardHandConfig: CardHandConfig.Any;
      CardPileConfig: CardPileConfig.Any;
    }
  }
}

/**
 * A DocumentSheet application responsible for displaying and editing a single Cards stack.
 * @remarks TODO: Stub, add generic for the type.
 */
declare class CardsConfig<
  RenderContext extends CardsConfig.RenderContext = CardsConfig.RenderContext,
  Configuration extends CardsConfig.Configuration = CardsConfig.Configuration,
  RenderOptions extends CardsConfig.RenderOptions = CardsConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Cards.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace CardsConfig {
  interface Any extends AnyCardsConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardsConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Cards.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Cards.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyCardsConfig extends CardsConfig<
  CardsConfig.RenderContext,
  CardsConfig.Configuration,
  CardsConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "deck" type.
 * @remarks TODO: Stub
 */
declare class CardDeckConfig<
  RenderContext extends CardDeckConfig.RenderContext = CardDeckConfig.RenderContext,
  Configuration extends CardDeckConfig.Configuration = CardDeckConfig.Configuration,
  RenderOptions extends CardDeckConfig.RenderOptions = CardDeckConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {}

declare namespace CardDeckConfig {
  interface Any extends AnyCardDeckConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardDeckConfig> {}

  interface RenderContext extends CardsConfig.RenderContext {}
  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardDeckConfig extends CardDeckConfig<
  CardDeckConfig.RenderContext,
  CardDeckConfig.Configuration,
  CardDeckConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "hand" type.
 * @remarks TODO: Stub
 */
declare class CardHandConfig<
  RenderContext extends CardHandConfig.RenderContext = CardHandConfig.RenderContext,
  Configuration extends CardHandConfig.Configuration = CardHandConfig.Configuration,
  RenderOptions extends CardHandConfig.RenderOptions = CardHandConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {}

declare namespace CardHandConfig {
  interface Any extends AnyCardHandConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardHandConfig> {}

  interface RenderContext extends CardsConfig.RenderContext {}
  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardHandConfig extends CardHandConfig<
  CardHandConfig.RenderContext,
  CardHandConfig.Configuration,
  CardHandConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A subclass of CardsConfig providing a sheet representation for Cards documents with the "pile" type.
 * @remarks TODO: Stub
 */
declare class CardPileConfig<
  RenderContext extends CardPileConfig.RenderContext = CardPileConfig.RenderContext,
  Configuration extends CardPileConfig.Configuration = CardPileConfig.Configuration,
  RenderOptions extends CardPileConfig.RenderOptions = CardPileConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {}

declare namespace CardPileConfig {
  interface Any extends AnyCardPileConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardPileConfig> {}

  interface RenderContext extends CardsConfig.RenderContext {}
  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardPileConfig extends CardPileConfig<
  CardPileConfig.RenderContext,
  CardPileConfig.Configuration,
  CardPileConfig.RenderOptions
> {
  constructor(...args: never);
}

export { CardsConfig, CardDeckConfig, CardHandConfig, CardPileConfig };
