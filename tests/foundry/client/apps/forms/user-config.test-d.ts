import { expectTypeOf } from "vitest";

// @ts-expect-error - a BaseUser is not a User
new UserConfig(new foundry.documents.BaseUser());

const config = new UserConfig(new User.implementation({ name: "foo" }));
expectTypeOf(config.object).toEqualTypeOf<User.ConfiguredInstance>();

const withCustomOptions = new UserConfig<DocumentSheetOptions<User.ConfiguredInstance> & { custom: true }>(
  new User.implementation({ name: "foo" }),
);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<
  DocumentSheetOptions<User.ConfiguredInstance> & { custom: true }
>();
