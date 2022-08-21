import { expectError, expectType } from "tsd";

const cards = new Cards({ name: "Just a deck of cards", type: "german" });

expectType<string | null>(cards.thumbnail);
expectType<Card[]>(cards.availableCards);
expectType<Card[]>(cards.drawnCards);

// deal
expectType<Promise<Cards>>(cards.deal([cards]));
expectType<Promise<Cards>>(cards.deal([cards], 2));
expectType<Promise<Cards>>(
  cards.deal([cards], 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectType<Promise<Cards>>(
  cards.deal([cards], undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(cards.deal([cards], undefined, { unknownProp: 0 }));
expectError(cards.deal([cards], undefined, { updateData: { unknownProp: 3 } }));

// pass
expectError(cards.pass(cards));
expectType<Promise<Card[]>>(cards.pass(cards, ["foo"]));
expectType<Promise<Card[]>>(
  cards.pass(cards, ["foo"], {
    action: "some custom action",
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(cards.pass(cards, ["foo"], { unknownProp: 0 }));
expectError(cards.pass(cards, ["foo"], { updateData: { unknownProp: 0 } }));

// draw
expectType<Promise<Card[]>>(cards.draw(cards));
expectType<Promise<Card[]>>(cards.draw(cards, 2));
expectType<Promise<Card[]>>(
  cards.draw(cards, 2, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 }
  })
);
expectType<Promise<Card[]>>(
  cards.draw(cards, undefined, {
    how: foundry.CONST.CARD_DRAW_MODES.RANDOM,
    action: "some custom action",
    updateData: { value: 3 }
  })
);
expectError(cards.draw(cards, undefined, { unknownProp: 0 }));
expectError(cards.draw(cards, undefined, { updateData: { unknownProp: 3 } }));

// shuffle
expectType<Promise<Cards>>(cards.shuffle());
expectType<Promise<Cards>>(
  cards.shuffle({
    updateData: {
      value: 1
    },
    chatNotification: true
  })
);
expectError(cards.shuffle({ unknownProp: 0 }));
expectError(cards.shuffle({ updateData: { unknownProp: 3 } }));

// reset
expectType<Promise<Cards>>(cards.reset());
expectType<Promise<Cards>>(
  cards.reset({
    updateData: {
      value: 1
    },
    chatNotification: true
  })
);
expectError(cards.reset({ unknownProp: 0 }));
expectError(cards.reset({ updateData: { unknownProp: 3 } }));

// dealDialog
expectType<Promise<Cards | null>>(cards.dealDialog());

// drawDialog
expectType<Promise<Card[] | null>>(cards.drawDialog());

// passDialog
expectType<Promise<Cards | null>>(cards.passDialog());

// playDialog
expectType<Promise<Card[] | void | null>>(cards.playDialog(new Card({ name: "Some Card" })));

// resetDialog
expectType<Promise<Cards | false | null>>(cards.resetDialog());
