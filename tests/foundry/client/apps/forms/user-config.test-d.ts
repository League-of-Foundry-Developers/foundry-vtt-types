import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

// @ts-expect-error - a BaseUser is not a User
new UserConfig(new foundry.documents.BaseUser());

declare const user: User;
const userConfig = new UserConfig(user);

expectTypeOf(userConfig.object).toEqualTypeOf<User>();
expectTypeOf(userConfig.document).toEqualTypeOf<User>();
expectTypeOf(UserConfig.defaultOptions).toEqualTypeOf<UserConfig.Options>();
expectTypeOf(userConfig.options).toEqualTypeOf<UserConfig.Options>();
expectTypeOf(userConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<UserConfig.UserConfigData>>>();
expectTypeOf(userConfig.render(true)).toEqualTypeOf<UserConfig>();

expectTypeOf(userConfig.title).toEqualTypeOf<string>();

const withCustomOptions = new UserConfig<DocumentSheetOptions<User.Implementation> & { custom: true }>(user);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<DocumentSheetOptions<User.Implementation> & { custom: true }>();
