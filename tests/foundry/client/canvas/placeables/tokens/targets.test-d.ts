import { expectTypeOf } from "vitest";
import { UserTargets } from "#client/canvas/placeables/tokens/_module.mjs";

declare const user: User.Implementation;
declare const token: Token.Implementation;

const targets = new UserTargets(user);
expectTypeOf(targets.user).toEqualTypeOf<User.Implementation>();
expectTypeOf(targets.ids).toEqualTypeOf<string[]>();
expectTypeOf(targets.add(token)).toEqualTypeOf<void>();
expectTypeOf(targets.clear()).toEqualTypeOf<void>();
expectTypeOf(targets.delete(token)).toEqualTypeOf<void>();
