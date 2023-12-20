import { expectTypeOf } from "vitest";

// @ts-expect-error - a BaseUser is not a User
new UserConfig(new foundry.documents.BaseUser());

const config = new UserConfig(new User());
expectTypeOf(config.object).toEqualTypeOf<User>();

const withCustomOptions = new UserConfig<DocumentSheetOptions<User> & { custom: true }>(new User());
expectTypeOf(withCustomOptions.options).toEqualTypeOf<DocumentSheetOptions<User> & { custom: true }>();
