import { expectTypeOf } from "vitest";

const sceneDirectory = new SceneDirectory();

expectTypeOf(SceneDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(sceneDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(sceneDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(sceneDirectory.render(true)).toEqualTypeOf<SceneDirectory>();
