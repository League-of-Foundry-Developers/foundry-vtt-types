import { expectTypeOf } from "vitest";

declare const user: User.Implementation;
declare const token: Token;

const targets = new UserTargets(user);
expectTypeOf(targets.user).toEqualTypeOf<User.Implementation>();
expectTypeOf(targets.ids).toEqualTypeOf<string[]>();
expectTypeOf(targets.add(token)).toEqualTypeOf<void>();
expectTypeOf(targets.clear()).toEqualTypeOf<void>();
expectTypeOf(targets.delete(token)).toEqualTypeOf<void>();
