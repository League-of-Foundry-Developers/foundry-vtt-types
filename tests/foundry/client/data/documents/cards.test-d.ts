import { expectTypeOf } from "vitest";

import FilePathField = foundry.data.fields.FilePathField;

// @ts-expect-error - Cards requires name.
new Cards();

// @ts-expect-error - Cards requires name.
new Cards({});

const cards = new Cards({ name: "Just a deck of cards", type: "german" });
expectTypeOf(cards).toEqualTypeOf<Cards>();

expectTypeOf(cards.thumbnail).toEqualTypeOf<FilePathField.InitializedType<any>>();
expectTypeOf(cards.availableCards).toEqualTypeOf<Card[]>();
expectTypeOf(cards.drawnCards).toEqualTypeOf<Card[]>();

// deal
expectTypeOf(cards.deal([cards])).toEqualTypeOf<Promise<Cards>>();
expectTypeOf(cards.deal([cards], 2)).toEqualTypeOf<Promise<Cards>>();
expectTypeOf(
  cards.deal([cards], 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "deal",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards>>();
expectTypeOf(
  cards.deal([cards], undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "pass",
    updateData: { description: "foo" },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards>>();

// @ts-expect-error - "unknownProp" is not a valid option
cards.deal([cards], undefined, { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
cards.deal([cards], undefined, { updateData: { unknownProp: 3 } });

// @ts-expect-error - There is no argument for the ids parameter
cards.pass(cards);

expectTypeOf(cards.pass(cards, ["foo"])).toEqualTypeOf<Promise<Card[]>>();
expectTypeOf(
  cards.pass(cards, ["foo"], {
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card[]>>();

// @ts-expect-error - "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
cards.pass(cards, ["foo"], { updateData: { unknownProp: 0 } });

// draw
expectTypeOf(cards.draw(cards)).toEqualTypeOf<Promise<Card[]>>();
expectTypeOf(cards.draw(cards, 2)).toEqualTypeOf<Promise<Card[]>>();
expectTypeOf(
  cards.draw(cards, 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card[]>>();
expectTypeOf(
  cards.draw(cards, undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 },
  }),
).toEqualTypeOf<Promise<Card[]>>();

// @ts-expect-error - "unknownProp" is not a valid option
cards.draw(cards, undefined, { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
cards.draw(cards, undefined, { updateData: { unknownProp: 3 } });

// shuffle
expectTypeOf(cards.shuffle()).toEqualTypeOf<Promise<Cards>>();
expectTypeOf(
  cards.shuffle({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards>>();

// @ts-expect-error - "unknownProp" is not a valid option
cards.shuffle({ unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
cards.shuffle({ updateData: { unknownProp: 3 } });

// reset
expectTypeOf(cards.reset()).toEqualTypeOf<Promise<Cards>>();
expectTypeOf(
  cards.reset({
    updateData: {
      value: 1,
    },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Cards>>();

// @ts-expect-error - "unknownProp" is not a valid option
cards.reset({ unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
cards.reset({ updateData: { unknownProp: 3 } });

// dealDialog
expectTypeOf(cards.dealDialog()).toEqualTypeOf<Promise<Cards | null>>();

// drawDialog
expectTypeOf(cards.drawDialog()).toEqualTypeOf<Promise<Card[] | null>>();

// passDialog
expectTypeOf(cards.passDialog()).toEqualTypeOf<Promise<Cards | null>>();

// playDialog
expectTypeOf(cards.playDialog(new Card({ name: "Some Card" }))).toEqualTypeOf<Promise<Card[] | void | null>>();

// resetDialog
expectTypeOf(cards.resetDialog()).toEqualTypeOf<Promise<Cards | false | null>>();

// TODO: Modify to Playlist | null once data can be grabbed from CONFIG
expectTypeOf(cards.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();
