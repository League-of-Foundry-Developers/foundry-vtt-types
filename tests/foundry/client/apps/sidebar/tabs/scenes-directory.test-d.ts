import { expectTypeOf } from "vitest";

const sceneDirectory = new SceneDirectory();

expectTypeOf(SceneDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(sceneDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(sceneDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(sceneDirectory.render(true)).toEqualTypeOf<SceneDirectory>();
