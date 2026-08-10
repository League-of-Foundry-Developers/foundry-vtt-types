import { afterAll, describe, expectTypeOf, expect, test } from "vitest";

import CardStacks = foundry.documents.collections.CardStacks;

describe("CardStacks Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({ name: "CardStacks Test Actor", type: "base" });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const stack = await Cards.implementation.create({ name: "CardStacks Test Actor", type: "deck" });
  if (!stack) throw new Error("Failed to create test Cards.");
  docsToCleanUp.add(stack);

  const cardsImpl = new Cards.implementation({ name: "CardStacks Test Actor", type: "deck" });
  const cardsSource = stack.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new CardStacks();
    new CardStacks([cardsSource]);

    // @ts-expect-error `Actor` data not assignable to `Cards` data
    new CardStacks([actorSource]);
  });

  const stacks = new CardStacks([cardsSource]);

  test("Inheritance", () => {
    expectTypeOf(stacks).toExtend<Collection.Any>();
    expectTypeOf(CardStacks).toExtend<Collection.AnyConstructor>();
    expect(stacks).toBeInstanceOf(Collection);
    expectTypeOf(stacks).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(CardStacks).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(stacks).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(stacks).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(CardStacks).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(stacks).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

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

    expectTypeOf(stacks.set("ID", stack)).toEqualTypeOf<typeof stacks>();

    expectTypeOf(stacks.delete("ID")).toBeBoolean();
  });

  test("importDocument fake override", async () => {
    // Passing a doc with no subtype data gets back a `Stored` without any either
    const imported1 = await stacks.importDocument(stack, {});
    if (!imported1) throw new Error("Failed to create test `Cards` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<Cards.Stored>();

    // Passing a doc with subtype info preserves it
    const imported2 = await stacks.importDocument(cardsImpl, {});
    if (!imported2) throw new Error("Failed to create test `Cards` via `#importDocument`");
    docsToCleanUp.add(imported2);
    expectTypeOf(imported2).toEqualTypeOf<Cards.Stored<"deck">>();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
