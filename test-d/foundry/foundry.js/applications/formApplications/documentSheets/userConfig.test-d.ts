import { expectError, expectType } from 'tsd';

expectError<UserConfig>(new UserConfig());
expectError<UserConfig>(new UserConfig(undefined, { width: 100 }));
expectError(new UserConfig(new foundry.documents.BaseUser()));

const config = new UserConfig(new User());
expectType<User>(config.object);
expectType<User>(config.getData().user);
expectType<Actor[]>(config.getData().actors);
expectType<DocumentSheet.Options>(config.getData().options);

const withCustomOptions = new UserConfig<DocumentSheet.Options & { custom: true }>(new User());
expectType<DocumentSheet.Options & { custom: true }>(withCustomOptions.options);
expectType<DocumentSheet.Options & { custom: true }>(withCustomOptions.getData().options);

const withCustomData = new UserConfig<DocumentSheet.Options, { me: User }>(new User());
expectType<{ me: User }>(withCustomData.getData());
