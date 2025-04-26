import { expectTypeOf } from "vitest";

const actorDirectory = new ActorDirectory();

expectTypeOf(ActorDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(actorDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(actorDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(actorDirectory.render(true)).toEqualTypeOf<ActorDirectory>();
