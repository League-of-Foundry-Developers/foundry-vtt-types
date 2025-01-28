import { expectTypeOf } from "vitest";

import CardFaceData = foundry.data.CardFaceData;

// @ts-expect-error - Card requires name.
new Card();

// @ts-expect-error - Card requires name.
new Card({});

// TODO: Investigate why this isn't complaining about specific types
const card = new Card({ name: "Just a single card", type: "base" });
const cards = new Cards({ name: "Some Card Deck", type: "deck" });

expectTypeOf(card.currentFace).toEqualTypeOf<CardFaceData | null>();
expectTypeOf(card.img).toEqualTypeOf<string>();
expectTypeOf(card.name).toEqualTypeOf<string>();
expectTypeOf(card.source).toEqualTypeOf<Cards.Implementation | undefined | null>();
expectTypeOf(card.isHome).toEqualTypeOf<boolean>();
expectTypeOf(card.showFace).toEqualTypeOf<boolean>();
expectTypeOf(card.hasNextFace).toEqualTypeOf<boolean>();
expectTypeOf(card.hasPreviousFace).toEqualTypeOf<boolean>();

// flip
expectTypeOf(card.flip()).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(card.flip(1)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(card.flip(null)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(card.flip(undefined)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();

// pass
expectTypeOf(card.pass(cards)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(
  card.pass(cards, {
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Implementation | undefined>>();

// @ts-expect-error - "unknownProp" is not a valid option
card.pass(cards, { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
card.pass(cards, { updateData: { unknownProp: 0 } });

// play
expectTypeOf(card.play(cards)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(
  card.play(cards, {
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Implementation | undefined>>();

// @ts-expect-error - "unknownProp" is not a valid option
card.play(cards, { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
card.play(cards, { updateData: { unknownProp: 0 } });

// discard
expectTypeOf(card.discard(cards)).toEqualTypeOf<Promise<Card.Implementation | undefined>>();
expectTypeOf(
  card.discard(cards, {
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Implementation | undefined>>();

// @ts-expect-error - "unknownProp" is not a valid option
card.discard(cards, { unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
card.discard(cards, { updateData: { unknownProp: 0 } });

// recall
expectTypeOf(card.recall()).toEqualTypeOf<Promise<Card.Implementation>>();
expectTypeOf(
  card.recall({
    updateData: { value: 3 },
    chatNotification: true,
  }),
).toEqualTypeOf<Promise<Card.Implementation>>();

// toMessage
expectTypeOf(card.toMessage()).toEqualTypeOf<Promise<ChatMessage.Implementation | undefined>>();
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
).toEqualTypeOf<Promise<ChatMessage.Implementation | undefined>>();

// @ts-expect-error - "unknownProp" is not a valid option
card.reset({ unknownProp: 0 });

// @ts-expect-error - "unknownProp" is not a valid option
card.reset({ updateData: { unknownProp: 0 } });
