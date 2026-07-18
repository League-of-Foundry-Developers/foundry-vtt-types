import { expectTypeOf } from "vitest";

declare const doc: Cards.Implementation;

const cardsConfig = new foundry.applications.sheets.CardsConfig({ document: doc });
expectTypeOf(cardsConfig.document).toEqualTypeOf<Cards.Implementation>();

expectTypeOf(
  foundry.applications.sheets.CardsConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();

const deckConfig = new foundry.applications.sheets.CardDeckConfig({ document: doc });
expectTypeOf(foundry.applications.sheets.CardDeckConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.CardDeckConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

const handConfig = new foundry.applications.sheets.CardHandConfig({ document: doc });
expectTypeOf(foundry.applications.sheets.CardHandConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

const pileConfig = new foundry.applications.sheets.CardPileConfig({ document: doc });
expectTypeOf(foundry.applications.sheets.CardPileConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(deckConfig.document).toEqualTypeOf<Cards.Implementation>();
expectTypeOf(handConfig.document).toEqualTypeOf<Cards.Implementation>();
expectTypeOf(pileConfig.document).toEqualTypeOf<Cards.Implementation>();

declare class _TestCardsConfigSubclass extends foundry.applications.sheets.CardsConfig {
  protected override _prepareCards(sortMode?: "standard" | "shuffled"): Card.Implementation[];
  protected override _onDragStart(event: DragEvent): Promise<void>;
}
