import { afterAll, describe, expect, expectTypeOf, test } from "vitest";

import Users = foundry.documents.collections.Users;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const userCreateData: User.CreateData;
declare const actor: Actor.Stored;
declare const wallCreateData: WallDocument.CreateData;

describe("Users Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const user = await User.implementation.create({ name: "Somebody" });
  if (!user) throw new Error("Failed to create test Setting");
  docsToCleanUp.add(user);

  const userImpl = new User.implementation({ name: "Somebody Else" });
  const userSource = user.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Users();
    new Users([userCreateData]);
    new Users([userSource]);

    // @ts-expect-error `WallDocument` data not assignable to `User` data
    new Users([wallCreateData]);
  });

  const users = new Users([userCreateData]);

  test("Inheritance", () => {
    expectTypeOf(users).toExtend<Collection.Any>();
    expectTypeOf(Users).toExtend<Collection.AnyConstructor>();
    expect(users).toBeInstanceOf(Collection);
    expectTypeOf(users).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(Users).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(users).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(users).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(Users).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(users).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

  test("Miscellaneous", () => {
    expectTypeOf(Users.documentName).toEqualTypeOf<"User">();
    expectTypeOf(Users.instance).toEqualTypeOf<Users.Implementation>();
    expectTypeOf(users.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(users.directory).toEqualTypeOf<DocumentDirectory<User.ImplementationClass> | undefined>();

    expectTypeOf(users.current).toEqualTypeOf<User.Stored | null>();

    expectTypeOf(users["_initialize"]()).toBeVoid();

    expectTypeOf(users.players).toEqualTypeOf<User.Stored[]>();
    expectTypeOf(users.activeGM).toEqualTypeOf<User.Stored | null>();

    expectTypeOf(
      users.getDesignatedUser((u) => u.active && !!u.flags.core?.sheetLock),
    ).toEqualTypeOf<User.Stored | null>();

    expectTypeOf(Users._activateSocketListeners(game.socket!)).toBeVoid();
  });

  test("Getting", () => {
    expectTypeOf(users.get("ID")).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", {})).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", { invalid: false, strict: false })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", { invalid: true, strict: true })).toEqualTypeOf<User.Invalid | User.Stored>();
    expectTypeOf(users.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<User.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(users.get("ID", { invalid: true, strict: true })).toEqualTypeOf<User.Invalid | User.Stored>();
    expectTypeOf(users.get("ID", { invalid: false, strict: true })).toEqualTypeOf<User.Stored>();
    expectTypeOf(users.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<User.Stored>();
    expectTypeOf(users.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<User.Stored>();
    expectTypeOf(users.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      User.Invalid | User.Stored
    >();
    expectTypeOf(users.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      User.Invalid | User.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(users.get("ID", { invalid: false, strict: true })).toEqualTypeOf<User.Stored>();
    expectTypeOf(users.get("ID", { invalid: false, strict: false })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      User.Stored | undefined
    >();
    expectTypeOf(users.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<User.Stored | undefined>();

    expectTypeOf(users.getInvalid("ID")).toEqualTypeOf<User.Invalid>();
    expectTypeOf(users.getInvalid("ID", {})).toEqualTypeOf<User.Invalid>();
    expectTypeOf(users.getInvalid("ID", { strict: false })).toEqualTypeOf<User.Invalid | undefined>();
    expectTypeOf(users.getInvalid("ID", { strict: undefined })).toEqualTypeOf<User.Invalid>();
    expectTypeOf(users.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<User.Invalid>();
    expectTypeOf(users.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<User.Invalid | undefined>();
    expectTypeOf(users.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<User.Invalid | undefined>();

    expectTypeOf(users.getName("name")).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.getName("name", {})).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.getName("name", { strict: true })).toEqualTypeOf<User.Stored>();
    expectTypeOf(users.getName("name", { strict: undefined })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<User.Stored | undefined>();
    expectTypeOf(users.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<User.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    users.set("ID", userImpl);
    // @ts-expect-error `Actor`s are not `User`s
    users.set("ID", actor);

    expectTypeOf(users.set("ID", user)).toEqualTypeOf<typeof users>();

    expectTypeOf(users.delete("ID")).toBeBoolean();
  });

  test("importDocument fake override", async () => {
    // `User`s don't have subtypes
    const imported1 = await users.importDocument(user, {});
    if (!imported1) throw new Error("Failed to create test `User` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<User.Stored>();
  });

  test("_prepareImportDocument", () => {
    // @ts-expect-error _prepareImportDocument will throw if not passed an object for `options`, because it lacks a signature default.
    expect(() => users["_prepareImportDocument"](user)).toThrow();

    expectTypeOf(users["_prepareImportDocument"](userImpl, {})).toEqualTypeOf<
      Omit<User.Source, "sort" | "navOrder" | "active" | "_id">
    >();

    // testing the FromCompendiumReturnType
    expectTypeOf(users["_prepareImportDocument"](user, { keepId: true })).toEqualTypeOf<
      Omit<User.Source, "sort" | "navOrder" | "active">
    >();
    expectTypeOf(users["_prepareImportDocument"](userImpl, { clearFolder: true })).toEqualTypeOf<
      Omit<User.Source, "sort" | "navOrder" | "active" | "_id" | "folder">
    >();

    // also testing CreateDocumentsOperation
    expectTypeOf(
      users["_prepareImportDocument"](userImpl, {
        clearFolder: true,
        noHook: false,
        renderSheet: true,
        documentName: "User", // This should error until we update db ops, but excess properties are not being errored on here for some reason
      }),
    ).toEqualTypeOf<Omit<User.Source, "sort" | "navOrder" | "active" | "_id" | "folder">>();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
