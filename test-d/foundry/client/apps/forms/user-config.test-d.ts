import { expectError, expectType } from "tsd";

expectError<UserConfig>(new UserConfig());
expectError<UserConfig>(new UserConfig(undefined, { width: 100 }));
expectError(new UserConfig(new foundry.documents.BaseUser()));

const config = new UserConfig(new User());
expectType<User>(config.object);

const withCustomOptions = new UserConfig<DocumentSheetOptions & { custom: true }>(new User());
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);
