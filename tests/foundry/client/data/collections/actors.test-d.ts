import { expectTypeOf } from "vitest";

const actors = new Actors([]);
expectTypeOf(actors.get("")).toEqualTypeOf<Actor.Stored>();
expectTypeOf(actors.get("", { strict: true, invalid: false })).toEqualTypeOf<Actor.Stored>();
expectTypeOf(actors.get("", { strict: true, invalid: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
expectTypeOf(actors.get("", { strict: false, invalid: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored | null>();
expectTypeOf(actors.get("", { strict: false, invalid: false })).toEqualTypeOf<Actor.Stored | null>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<Actor.Stored["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory>();
expectTypeOf(actors.tokens.foo).toEqualTypeOf<Actor.Implementation | undefined>();
