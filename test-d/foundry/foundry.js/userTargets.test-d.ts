import { expectType } from 'tsd';

declare const user: User;
declare const token: Token;

const targets = new UserTargets(user);
expectType<User>(targets.user);
expectType<string[]>(targets.ids);
expectType<void>(targets.add(token));
expectType<void>(targets.clear());
expectType<void>(targets.delete(token));
