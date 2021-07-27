import { expectType } from 'tsd';

declare const user: User;
declare const token: Token;

const targets = new UserTargets(user);
expectType<User>(targets.user);
expectType<string[]>(targets.ids);
expectType<any>(targets.add(token));
expectType<void>(targets.clear());
expectType<any>(targets.delete(token));
