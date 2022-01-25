import { expectError, expectType } from 'tsd';

expectError<UserConfig>(new UserConfig());
expectError<UserConfig>(new UserConfig(undefined, { width: 100 }));
expectError(new UserConfig(new foundry.documents.BaseUser()));

const config = new UserConfig(new User());
expectType<User>(config.object);
expectType<User>(config.getData().user);
expectType<Actor[]>(config.getData().actors);
expectType<DocumentSheetOptions>(config.getData().options);

const withCustomOptions = new UserConfig<DocumentSheetOptions & { custom: true }>(new User());
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.getData().options);

const withCustomData = new UserConfig<DocumentSheetOptions, { me: User }>(new User());
expectType<{ me: User }>(withCustomData.getData());
