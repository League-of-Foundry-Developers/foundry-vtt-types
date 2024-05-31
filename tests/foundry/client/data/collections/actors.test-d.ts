import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const actors = new Actors();
expectTypeOf(actors.get("", { strict: true })).toEqualTypeOf<StoredDocument<Actor>>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<StoredDocument<Actor>["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory | undefined>();
expectTypeOf(actors.tokens["foo"]).toEqualTypeOf<Actor | undefined>();
