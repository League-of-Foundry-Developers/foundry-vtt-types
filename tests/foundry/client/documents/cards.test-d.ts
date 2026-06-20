import { expectTypeOf } from "vitest";

import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

// @ts-expect-error Cards requires name.
new Cards.implementation();

// @ts-expect-error Cards requires name.
new Cards.implementation({});

// @ts-expect-error "german" is not a valid type
new Cards.implementation({ name: "Just a deck of cards", type: "german" });

declare const storedCard: Card.Stored;

declare const cards: Cards.Stored<"deck">;

expectTypeOf(cards.thumbnail).toEqualTypeOf<string | null>();
expectTypeOf(cards.availableCards).toEqualTypeOf<Card.Stored[]>();
expectTypeOf(cards.drawnCards).toEqualTypeOf<Card.Stored[]>();

const _x = await cards.deal([cards]);
// deal
expectTypeOf(cards.deal([cards])).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();
expectTypeOf(cards.deal([cards], 2)).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();
expectTypeOf(
  cards.deal([cards], 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "deal",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();
expectTypeOf(
  cards.deal([cards], undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "pass",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.deal([cards], undefined, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.deal([cards], undefined, { updateData: { unknownProp: 3 } });

// @ts-expect-error There is no argument for the ids parameter
cards.pass(cards);

expectTypeOf(cards.pass(cards, ["foo"])).toEqualTypeOf<Promise<Card.Stored[]>>();
expectTypeOf(
  cards.pass(cards, ["foo"], {
    action: "discard",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Stored[]>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { updateData: { unknownProp: 0 } });

// draw
expectTypeOf(cards.draw(cards)).toEqualTypeOf<Promise<Card.Stored[]>>();
expectTypeOf(cards.draw(cards, 2)).toEqualTypeOf<Promise<Card.Stored[]>>();
expectTypeOf(
  cards.draw(cards, 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card.Stored[]>>();
expectTypeOf(
  cards.draw(cards, undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card.Stored[]>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.draw(cards, undefined, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.draw(cards, undefined, { updateData: { unknownProp: 3 } });

// shuffle
expectTypeOf(cards.shuffle()).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();
expectTypeOf(
  cards.shuffle({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.shuffle({ unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.shuffle({ updateData: { unknownProp: 3 } });

// recall
expectTypeOf(cards.recall()).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();
expectTypeOf(
  cards.recall({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Stored<"deck">>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.reset({ unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.reset({ updateData: { unknownProp: 3 } });

// dealDialog
expectTypeOf(cards.dealDialog()).toEqualTypeOf<Promise<Cards.Stored<"deck"> | null>>();

// drawDialog
expectTypeOf(cards.drawDialog()).toEqualTypeOf<Promise<Card.Stored[] | null>>();

// passDialog
expectTypeOf(cards.passDialog()).toEqualTypeOf<Promise<Cards.Stored<"deck"> | null>>();

// playDialog
expectTypeOf(cards.playDialog(storedCard)).toEqualTypeOf<Promise<Card.Stored[] | null>>();

// resetDialog
expectTypeOf(cards.resetDialog()).toEqualTypeOf<Promise<Cards.Stored<"deck"> | false | null>>();

expectTypeOf(cards.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();
