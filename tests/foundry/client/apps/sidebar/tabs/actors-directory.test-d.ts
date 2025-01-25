import { expectTypeOf } from "vitest";

const actorDirectory = new ActorDirectory();

expectTypeOf(ActorDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(actorDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(actorDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(actorDirectory.render(true)).toEqualTypeOf<ActorDirectory>();
