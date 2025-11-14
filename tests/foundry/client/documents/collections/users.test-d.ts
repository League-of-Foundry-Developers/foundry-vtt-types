import { describe, expectTypeOf, test } from "vitest";

import Users = foundry.documents.collections.Users;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const userCreateData: User.CreateData;
declare const userSource: User.Source;
declare const stack: User.Stored;
declare const userImpl: User.Implementation;
declare const actor: Actor.Stored;
declare const wallCreateData: WallDocument.CreateData;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Users Tests", () => {
  test("Construction", () => {
    new Users();
    new Users([userCreateData]);
    new Users([userSource]);

    // @ts-expect-error `WallDocument` data not assignable to `User` data
    new Users([wallCreateData]);
  });

  const users = new Users([userCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Users.documentName).toEqualTypeOf<"User">();
    expectTypeOf(Users.instance).toEqualTypeOf<Users.Implementation>();
    expectTypeOf(users.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(users.directory).toEqualTypeOf<DocumentDirectory<User.ImplementationClass> | undefined>();
    expectTypeOf(users.name).toEqualTypeOf<"Users">();

    expectTypeOf(users.current).toEqualTypeOf<User.Stored | null>();

    expectTypeOf(users["_initialize"]()).toBeVoid();

    expectTypeOf(users.players).toEqualTypeOf<User.Stored[]>();
    expectTypeOf(users.activeGM).toEqualTypeOf<User.Stored | null>();

    expectTypeOf(
      users.getDesignatedUser((u) => u.active && !!u.flags?.core?.sheetLock),
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
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(users.set("ID", stack)).toBeVoid();

    expectTypeOf(users.delete("ID")).toBeBoolean();
  });
});
