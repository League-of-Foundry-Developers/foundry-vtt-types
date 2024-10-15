import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const actors = new Actors([]);
expectTypeOf(actors.get("", { strict: true })).toEqualTypeOf<Document.Stored<Actor>>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<Document.Stored<Actor>["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory>();
expectTypeOf(actors.tokens["foo"]).toEqualTypeOf<Actor | undefined>();
