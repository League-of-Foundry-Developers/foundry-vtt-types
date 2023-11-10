import { expectTypeOf } from "vitest";

const actors = new Actors();
expectTypeOf(actors.get("", { strict: true })).toEqualTypeOf<StoredDocument<Actor>>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<StoredDocument<Actor>["data"]["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory | undefined>();
expectTypeOf(actors.tokens["foo"]).toEqualTypeOf<Actor | undefined>();
