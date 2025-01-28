import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const actors = new Actors([]);
expectTypeOf(actors.get("", { strict: true })).toEqualTypeOf<Actor.Stored>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<Actor.Stored["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory>();
expectTypeOf(actors.tokens["foo"]).toEqualTypeOf<Actor | undefined>();
