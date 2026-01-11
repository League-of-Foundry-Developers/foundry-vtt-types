import { expectTypeOf } from "vitest";

import FormApplication = foundry.appv1.api.FormApplication;

// @ts-expect-error Cards requires name.
new Cards.implementation();

// @ts-expect-error Cards requires name.
new Cards.implementation({});

// @ts-expect-error "german" is not a valid type
new Cards.implementation({ name: "Just a deck of cards", type: "german" });

const cards = new Cards.implementation({ name: "Just a deck of cards", type: "deck" });
expectTypeOf(cards).toEqualTypeOf<Cards.OfType<"deck">>();

expectTypeOf(cards.thumbnail).toEqualTypeOf<string | null>();
expectTypeOf(cards.availableCards).toEqualTypeOf<Card.Implementation[]>();
expectTypeOf(cards.drawnCards).toEqualTypeOf<Card.Implementation[]>();

// deal
expectTypeOf(cards.deal([cards])).toEqualTypeOf<Promise<Cards.Implementation>>();
expectTypeOf(cards.deal([cards], 2)).toEqualTypeOf<Promise<Cards.Implementation>>();
expectTypeOf(
  cards.deal([cards], 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "deal",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Implementation>>();
expectTypeOf(
  cards.deal([cards], undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "pass",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.Implementation>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.deal([cards], undefined, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.deal([cards], undefined, { updateData: { unknownProp: 3 } });

// @ts-expect-error There is no argument for the ids parameter
cards.pass(cards);

expectTypeOf(cards.pass(cards, ["foo"])).toEqualTypeOf<Promise<Card.Implementation[]>>();
expectTypeOf(
  cards.pass(cards, ["foo"], {
    action: "discard",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Implementation[]>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { updateData: { unknownProp: 0 } });

// draw
expectTypeOf(cards.draw(cards)).toEqualTypeOf<Promise<Card.Implementation[]>>();
expectTypeOf(cards.draw(cards, 2)).toEqualTypeOf<Promise<Card.Implementation[]>>();
expectTypeOf(
  cards.draw(cards, 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card.Implementation[]>>();
expectTypeOf(
  cards.draw(cards, undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card.Implementation[]>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.draw(cards, undefined, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.draw(cards, undefined, { updateData: { unknownProp: 3 } });

// shuffle
expectTypeOf(cards.shuffle()).toEqualTypeOf<Promise<Cards.OfType<"deck">>>();
expectTypeOf(
  cards.shuffle({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.OfType<"deck">>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.shuffle({ unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.shuffle({ updateData: { unknownProp: 3 } });

// recall
expectTypeOf(cards.recall()).toEqualTypeOf<Promise<Cards.OfType<"deck">>>();
expectTypeOf(
  cards.recall({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards.OfType<"deck">>>();

// @ts-expect-error "unknownProp" is not a valid option
cards.reset({ unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
cards.reset({ updateData: { unknownProp: 3 } });

// dealDialog
expectTypeOf(cards.dealDialog()).toEqualTypeOf<Promise<Cards.OfType<"deck"> | null>>();

// drawDialog
expectTypeOf(cards.drawDialog()).toEqualTypeOf<Promise<Card.Implementation[] | null>>();

// passDialog
expectTypeOf(cards.passDialog()).toEqualTypeOf<Promise<Cards.OfType<"deck"> | null>>();

// playDialog
expectTypeOf(cards.playDialog(new Card.implementation({ name: "Some Card" }))).toEqualTypeOf<
  Promise<Card.Implementation[] | null>
>();

// resetDialog
expectTypeOf(cards.resetDialog()).toEqualTypeOf<Promise<Cards.OfType<"deck"> | false | null>>();

// TODO: Modify to Playlist | null once data can be grabbed from CONFIG
expectTypeOf(cards.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
