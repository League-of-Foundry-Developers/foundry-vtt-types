import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const actors = new Actors([]);
expectTypeOf(actors.get("", { strict: true })).toEqualTypeOf<Document.Stored<Actor>>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<Document.Stored<Actor>["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory>();
expectTypeOf(actors.tokens.foo).toEqualTypeOf<Actor | undefined>();
