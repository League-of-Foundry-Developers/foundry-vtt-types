import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import CardsConfig = foundry.applications.sheets.CardsConfig;
import CardDeckConfig = foundry.applications.sheets.CardDeckConfig;
import CardHandConfig = foundry.applications.sheets.CardHandConfig;
import CardPileConfig = foundry.applications.sheets.CardPileConfig;

declare const doc: Cards.Implementation;
const cardsConfig = new CardsConfig({ document: doc });

expectTypeOf(cardsConfig.document).toEqualTypeOf<Cards.Implementation>();

expectTypeOf(CardsConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(CardDeckConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: CardsConfig.RenderContext;
expectTypeOf(context.inCompendium).toBeBoolean();
expectTypeOf(context.cards).toEqualTypeOf<Card.Implementation[] | undefined>();
expectTypeOf(context.sortModeIcon).toEqualTypeOf<string | undefined>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[] | undefined>();

declare const renderOptions: CardsConfig.RenderOptions;
expectTypeOf(renderOptions.sortMode).toEqualTypeOf<CardsConfig.SortMode | undefined>();

class CustomCardsConfig extends CardsConfig {
  protected override _prepareCards(sortMode?: CardsConfig.SortMode): Card.Implementation[] {
    return super._prepareCards(sortMode);
  }

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[] {
    return super._prepareButtons();
  }
}

expectTypeOf(CustomCardsConfig).toExtend<CardsConfig.AnyConstructor>();
expectTypeOf(new CardDeckConfig({ document: doc })).toExtend<CardsConfig.Any>();
expectTypeOf(new CardHandConfig({ document: doc })).toExtend<CardsConfig.Any>();
expectTypeOf(new CardPileConfig({ document: doc })).toExtend<CardsConfig.Any>();
