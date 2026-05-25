import { expectTypeOf } from "vitest";

// @ts-expect-error Card requires name.
new Card.implementation();

// @ts-expect-error Card requires name.
new Card.implementation({});

declare const card: Card.Stored<"base">;
declare const cards: Cards.Stored<"deck">;

expectTypeOf(card.currentFace).toEqualTypeOf<Card.FaceData | null>();
expectTypeOf(card.img).toEqualTypeOf<string>();
expectTypeOf(card.name).toEqualTypeOf<string>();
expectTypeOf(card.source).toEqualTypeOf<Cards.Stored | null>();
expectTypeOf(card.isHome).toEqualTypeOf<boolean>();
expectTypeOf(card.showFace).toEqualTypeOf<boolean>();
expectTypeOf(card.hasNextFace).toEqualTypeOf<boolean>();
expectTypeOf(card.hasPreviousFace).toEqualTypeOf<boolean>();

// flip
expectTypeOf(card.flip()).toEqualTypeOf<Promise<Card.Stored<"base"> | undefined>>();
expectTypeOf(card.flip(1)).toEqualTypeOf<Promise<Card.Stored<"base"> | undefined>>();
expectTypeOf(card.flip(null)).toEqualTypeOf<Promise<Card.Stored<"base"> | undefined>>();
expectTypeOf(card.flip(undefined)).toEqualTypeOf<Promise<Card.Stored<"base"> | undefined>>();

// pass (these returns lose subtype data because they return a doc created on a new parent)
expectTypeOf(card.pass(cards)).toEqualTypeOf<Promise<Card.Stored | undefined>>();
expectTypeOf(
  card.pass(cards, {
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Stored | undefined>>();

// @ts-expect-error "unknownProp" is not a valid option
card.pass(cards, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
card.pass(cards, { updateData: { unknownProp: 0 } });

// play (these returns lose subtype data because they return a doc created on a new parent)
expectTypeOf(card.play(cards)).toEqualTypeOf<Promise<Card.Stored | undefined>>();
expectTypeOf(
  card.play(cards, {
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Stored | undefined>>();

// @ts-expect-error "unknownProp" is not a valid option
card.play(cards, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
card.play(cards, { updateData: { unknownProp: 0 } });

// discard (these returns lose subtype data because they return a doc created on a new parent)
expectTypeOf(card.discard(cards)).toEqualTypeOf<Promise<Card.Stored | undefined>>();
expectTypeOf(
  card.discard(cards, {
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Stored | undefined>>();

// @ts-expect-error "unknownProp" is not a valid option
card.discard(cards, { unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
card.discard(cards, { updateData: { unknownProp: 0 } });

// recall
expectTypeOf(card.recall()).toEqualTypeOf<Promise<Card.Stored | undefined>>();
expectTypeOf(
  card.recall({
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Stored | undefined>>();

// toMessage
expectTypeOf(card.toMessage()).toEqualTypeOf<Promise<ChatMessage.Stored | undefined>>();
expectTypeOf(
  card.toMessage(
    {
      speaker: {
        alias: "The Speaker",
      },
    },
    {
      noHook: true,
    },
  ),
).toEqualTypeOf<Promise<ChatMessage.Stored | undefined>>();

// @ts-expect-error "unknownProp" is not a valid option
card.reset({ unknownProp: 0 });

// @ts-expect-error "unknownProp" is not a valid option
card.reset({ updateData: { unknownProp: 0 } });
