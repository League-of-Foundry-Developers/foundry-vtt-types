import { afterAll, describe, expectTypeOf, test } from "vitest";

import Journal = foundry.documents.collections.Journal;

describe("Journal Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const je = await JournalEntry.implementation.create({ name: "Journal Collection Test JournalEntry" });
  if (!je) throw new Error("Failed to create test JournalEntry.");
  docsToCleanUp.add(je);

  const jeSource = je.toObject();
  const jeImpl = new JournalEntry.implementation({ name: "Journal Collection Test JournalEntry" });

  const actor = await Actor.implementation.create({
    name: "Journal Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject;

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Journal();
    new Journal([jeSource]);

    // @ts-expect-error `Actor` source not assignable to `JournalEntry` source
    new Journal([actorSource]);
  });

  const journals = new Journal([jeSource]);

  test("Miscellaneous", () => {
    expectTypeOf(Journal.documentName).toEqualTypeOf<"JournalEntry">();
    expectTypeOf(Journal.instance).toEqualTypeOf<Journal.Implementation>();
    expectTypeOf(journals.folders).toEqualTypeOf<Collection<Folder.Stored<"JournalEntry">>>();
    expectTypeOf(journals.directory).toEqualTypeOf<typeof ui.journal>();

    expectTypeOf(Journal._activateSocketListeners(game.socket!)).toBeVoid();
  });

  test("Showing", () => {
    expectTypeOf(Journal.showDialog(je)).toEqualTypeOf<Promise<void>>();

    expectTypeOf(Journal.show(je)).toEqualTypeOf<Promise<JournalEntry.Stored>>();
    expectTypeOf(Journal.show(je, {})).toEqualTypeOf<Promise<JournalEntry.Stored>>();
    expectTypeOf(Journal.show(je, { force: true, users: ["id1", "id2"] })).toEqualTypeOf<
      Promise<JournalEntry.Stored>
    >();
    expectTypeOf(Journal.show(je, { force: undefined, users: undefined })).toEqualTypeOf<
      Promise<JournalEntry.Stored>
    >();

    // @ts-expect-error must pass at least a `title` in options
    Journal.showImage("path/to/image.png");
    expectTypeOf(Journal.showImage("path/to/image.png", { title: "An Image" })).toBeVoid();
    expectTypeOf(
      Journal.showImage("path/to/image.png", {
        title: "An Image",
        caption: "A Caption",
        showTitle: false,
        uuid: "UUID",
        users: ["ID1", "ID2"],
      }),
    ).toBeVoid();
    expectTypeOf(
      Journal.showImage("path/to/image.png", {
        title: "An Image",
        // caption: undefined,   // Not allowed to be undefined because it wouldn't survive the socket
        // showTitle: undefined, // Not allowed to be undefined because it wouldn't survive the socket
        // uuid: undefined,      // Not allowed to be undefined because it wouldn't survive the socket
        users: undefined,
      }),
    ).toBeVoid();

    expectTypeOf(Journal._showEntry("UUID")).toEqualTypeOf<Promise<void>>();
    expectTypeOf(Journal._showEntry("UUID", true)).toEqualTypeOf<Promise<void>>();
  });

  test("Getting", () => {
    expectTypeOf(journals.get("ID")).toEqualTypeOf<JournalEntry.Stored | undefined>();
    expectTypeOf(journals.get("ID", {})).toEqualTypeOf<JournalEntry.Stored | undefined>();
    expectTypeOf(journals.get("ID", { invalid: false, strict: false })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      JournalEntry.Invalid | JournalEntry.Stored
    >();
    expectTypeOf(journals.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(journals.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      JournalEntry.Invalid | JournalEntry.Stored
    >();
    expectTypeOf(journals.get("ID", { invalid: false, strict: true })).toEqualTypeOf<JournalEntry.Stored>();
    expectTypeOf(journals.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<JournalEntry.Stored>();
    expectTypeOf(journals.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<JournalEntry.Stored>();
    expectTypeOf(journals.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      JournalEntry.Invalid | JournalEntry.Stored
    >();
    expectTypeOf(journals.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      JournalEntry.Invalid | JournalEntry.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(journals.get("ID", { invalid: false, strict: true })).toEqualTypeOf<JournalEntry.Stored>();
    expectTypeOf(journals.get("ID", { invalid: false, strict: false })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();

    expectTypeOf(journals.getInvalid("ID")).toEqualTypeOf<JournalEntry.Invalid>();
    expectTypeOf(journals.getInvalid("ID", {})).toEqualTypeOf<JournalEntry.Invalid>();
    expectTypeOf(journals.getInvalid("ID", { strict: false })).toEqualTypeOf<JournalEntry.Invalid | undefined>();
    expectTypeOf(journals.getInvalid("ID", { strict: undefined })).toEqualTypeOf<JournalEntry.Invalid>();
    expectTypeOf(journals.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<JournalEntry.Invalid>();
    expectTypeOf(journals.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<
      JournalEntry.Invalid | undefined
    >();
    expectTypeOf(journals.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<
      JournalEntry.Invalid | undefined
    >();

    expectTypeOf(journals.getName("name")).toEqualTypeOf<JournalEntry.Stored | undefined>();
    expectTypeOf(journals.getName("name", {})).toEqualTypeOf<JournalEntry.Stored | undefined>();
    expectTypeOf(journals.getName("name", { strict: true })).toEqualTypeOf<JournalEntry.Stored>();
    expectTypeOf(journals.getName("name", { strict: undefined })).toEqualTypeOf<JournalEntry.Stored | undefined>();
    expectTypeOf(journals.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
    expectTypeOf(journals.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<
      JournalEntry.Stored | undefined
    >();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    journals.set("ID", jeImpl);
    // @ts-expect-error `Actor`s are not `JournalEntry`s
    journals.set("ID", actor);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(journals.set("ID", je)).toBeVoid();

    expectTypeOf(journals.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
