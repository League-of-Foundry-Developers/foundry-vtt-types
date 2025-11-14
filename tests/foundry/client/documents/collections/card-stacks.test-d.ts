import { describe, expectTypeOf, test } from "vitest";

import CardStacks = foundry.documents.collections.CardStacks;

declare const cardsCreateData: Cards.CreateData;
declare const cardsSource: Cards.Source;
declare const stack: Cards.Stored;
declare const cardsImpl: Cards.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("CardStacks Tests", () => {
  test("Construction", () => {
    new CardStacks();
    new CardStacks([cardsCreateData]);
    new CardStacks([cardsSource]);

    // @ts-expect-error `Actor` data not assignable to `Cards` data
    new CardStacks([actorCreateData]);
  });

  const stacks = new CardStacks([cardsCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(CardStacks.documentName).toEqualTypeOf<"Cards">();
    expectTypeOf(CardStacks.instance).toEqualTypeOf<CardStacks.Implementation>();
    expectTypeOf(stacks.folders).toEqualTypeOf<Collection<Folder.Stored<"Cards">>>();
    expectTypeOf(stacks.directory).toEqualTypeOf<typeof ui.cards>();
  });

  test("Getting", () => {
    expectTypeOf(stacks.get("ID")).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.get("ID", {})).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Cards.Invalid | Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Cards.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(stacks.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Cards.Invalid | Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Cards.Invalid | Cards.Stored
    >();
    expectTypeOf(stacks.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Cards.Invalid | Cards.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(stacks.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Cards.Stored>();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Cards.Stored | undefined
    >();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Cards.Stored | undefined
    >();
    expectTypeOf(stacks.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Cards.Stored | undefined
    >();

    expectTypeOf(stacks.getInvalid("ID")).toEqualTypeOf<Cards.Invalid>();
    expectTypeOf(stacks.getInvalid("ID", {})).toEqualTypeOf<Cards.Invalid>();
    expectTypeOf(stacks.getInvalid("ID", { strict: false })).toEqualTypeOf<Cards.Invalid | undefined>();
    expectTypeOf(stacks.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Cards.Invalid>();
    expectTypeOf(stacks.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Cards.Invalid>();
    expectTypeOf(stacks.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Cards.Invalid | undefined>();
    expectTypeOf(stacks.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Cards.Invalid | undefined>();

    expectTypeOf(stacks.getName("name")).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.getName("name", {})).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.getName("name", { strict: true })).toEqualTypeOf<Cards.Stored>();
    expectTypeOf(stacks.getName("name", { strict: undefined })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Cards.Stored | undefined>();
    expectTypeOf(stacks.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Cards.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    stacks.set("ID", cardsImpl);
    // @ts-expect-error `Actor`s are not `Cards`s
    stacks.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(stacks.set("ID", stack)).toBeVoid();

    expectTypeOf(stacks.delete("ID")).toBeBoolean();
  });
});
