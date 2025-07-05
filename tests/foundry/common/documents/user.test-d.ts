import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseUser.create({ name: "SomeUser" })).toEqualTypeOf<Promise<User.Stored | undefined>>();
expectTypeOf(foundry.documents.BaseUser.createDocuments([])).toEqualTypeOf<Promise<User.Stored[]>>();
expectTypeOf(foundry.documents.BaseUser.updateDocuments([])).toEqualTypeOf<Promise<User.Implementation[]>>();
expectTypeOf(foundry.documents.BaseUser.deleteDocuments([])).toEqualTypeOf<Promise<User.Implementation[]>>();

const user = await foundry.documents.BaseUser.create({ name: "Another User" }, { temporary: true });
if (user) {
  // Note(LukeAbby): At one point there was a regression in `ForeignDocumentField` that would have caused this to fail.
  expectTypeOf(user.character).toEqualTypeOf<Actor.Stored | null>();
}

class TestBaseUser extends foundry.documents.BaseUser {}

// @ts-expect-error - name may not be undefined
new TestBaseUser();

const baseUser = new TestBaseUser({ name: "foo" });
expectTypeOf(baseUser.hasRole("NONE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole("PLAYER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole("TRUSTED")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole("ASSISTANT")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole("GAMEMASTER")).toEqualTypeOf<boolean>();

expectTypeOf(baseUser.hasRole(CONST.USER_ROLES.NONE)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole(CONST.USER_ROLES.PLAYER)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole(CONST.USER_ROLES.TRUSTED)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole(CONST.USER_ROLES.ASSISTANT)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasRole(CONST.USER_ROLES.GAMEMASTER)).toEqualTypeOf<boolean>();

// @ts-expect-error - "ACTOR_CREATE" is not a valid role.
baseUser.hasRole("ACTOR_CREATE");

// @ts-expect-error - -1 is not a valid role.
baseUser.hasRole(-1);

// @ts-expect-error - 100 is not a valid role.
baseUser.hasRole(100);

expectTypeOf(baseUser.can("NONE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("PLAYER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("TRUSTED")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("ASSISTANT")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("GAMEMASTER")).toEqualTypeOf<boolean>();

expectTypeOf(baseUser.can(CONST.USER_ROLES.NONE)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can(CONST.USER_ROLES.PLAYER)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can(CONST.USER_ROLES.TRUSTED)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can(CONST.USER_ROLES.ASSISTANT)).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can(CONST.USER_ROLES.GAMEMASTER)).toEqualTypeOf<boolean>();

expectTypeOf(baseUser.can("ACTOR_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("BROADCAST_AUDIO")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("BROADCAST_VIDEO")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("DRAWING_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("ITEM_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("FILES_BROWSE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("FILES_UPLOAD")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("JOURNAL_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("MACRO_SCRIPT")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("MESSAGE_WHISPER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("NOTE_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("SETTINGS_MODIFY")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("SHOW_CURSOR")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("SHOW_RULER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("TEMPLATE_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("TOKEN_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("TOKEN_CONFIGURE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.can("WALL_DOORS")).toEqualTypeOf<boolean>();

// @ts-expect-error - -1 is not a valid action.
baseUser.can(-1);

// @ts-expect-error - 0 is not a valid action.
baseUser.can(100);

// @ts-expect-error - "SHOW_RULERS" is not a valid action.
baseUser.can("SHOW_RULERS");

expectTypeOf(baseUser.hasPermission("ACTOR_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("BROADCAST_AUDIO")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("BROADCAST_VIDEO")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("DRAWING_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("ITEM_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("FILES_BROWSE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("FILES_UPLOAD")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("JOURNAL_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("MACRO_SCRIPT")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("MESSAGE_WHISPER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("NOTE_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("SETTINGS_MODIFY")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("SHOW_CURSOR")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("SHOW_RULER")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("TEMPLATE_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("TOKEN_CREATE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("TOKEN_CONFIGURE")).toEqualTypeOf<boolean>();
expectTypeOf(baseUser.hasPermission("WALL_DOORS")).toEqualTypeOf<boolean>();

// @ts-expect-error - "GAMEMASTER" is not a valid permission.
baseUser.hasPermission("GAMEMASTER");

// @ts-expect-error - CONST.USER_ROLES.GAMEMASTER is not a valid permission.
baseUser.hasPermission(CONST.USER_ROLES.GAMEMASTER);

// @ts-expect-error - 10 is not a valid permission.
baseUser.hasPermission(10);

// @ts-expect-error - "SHOW_RULERS" is not a valid permission.
baseUser.hasPermission("SHOW_RULERS");
