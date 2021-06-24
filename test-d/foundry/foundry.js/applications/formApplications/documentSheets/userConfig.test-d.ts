import { expectError, expectType } from 'tsd';

expectType<UserConfig>(new UserConfig(new User()));
expectType<UserConfig>(new UserConfig());
expectType<UserConfig>(new UserConfig(undefined, { width: 100 }));
expectError(new UserConfig(new foundry.documents.BaseUser()));

const config = new UserConfig();
expectType<User>(config.object);
expectType<User>(config.getData().user);
expectType<Actor[]>(config.getData().actors);
expectType<DocumentSheet.Options>(config.getData().options);

const withCustomOptions = new UserConfig<DocumentSheet.Options & { custom: true }>();
expectType<DocumentSheet.Options & { custom: true }>(withCustomOptions.options);
expectType<DocumentSheet.Options & { custom: true }>(withCustomOptions.getData().options);

const withCustomData = new UserConfig<DocumentSheet.Options, { me: User }>();
expectType<{ me: User }>(withCustomData.getData());
