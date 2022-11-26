import { expectError, expectType } from "tsd";

expectError(new UserConfig(new foundry.documents.BaseUser()));

const config = new UserConfig(new User());
expectType<User>(config.object);

const withCustomOptions = new UserConfig<DocumentSheetOptions<User> & { custom: true }>(new User());
expectType<DocumentSheetOptions<User> & { custom: true }>(withCustomOptions.options);
