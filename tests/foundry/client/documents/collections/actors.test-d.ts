import { expectTypeOf } from "vitest";
import { Actors } from "#client/documents/collections/_module.mjs";

import ActorDirectory = foundry.applications.sidebar.tabs.ActorDirectory;

const actors = new Actors([]);
expectTypeOf(actors.get("")).toEqualTypeOf<Actor.Stored | undefined>();
expectTypeOf(actors.get("", { strict: true, invalid: false })).toEqualTypeOf<Actor.Stored>();
expectTypeOf(actors.get("", { strict: true, invalid: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
expectTypeOf(actors.get("", { strict: false, invalid: true })).toEqualTypeOf<
  Actor.Invalid | Actor.Stored | undefined
>();
expectTypeOf(actors.get("", { strict: false, invalid: false })).toEqualTypeOf<Actor.Stored | undefined>();
expectTypeOf(actors.toJSON()).toEqualTypeOf<Actor.Stored["_source"][]>();
expectTypeOf(actors.directory).toEqualTypeOf<ActorDirectory.Any | undefined>();
expectTypeOf(actors.tokens["foo"]).toEqualTypeOf<Actor.Implementation | undefined>();
