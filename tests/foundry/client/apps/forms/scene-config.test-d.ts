import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const scene: Scene.Implementation;
const sceneConfig = new SceneConfig(scene);

expectTypeOf(sceneConfig.object).toEqualTypeOf<Scene>();
expectTypeOf(sceneConfig.document).toEqualTypeOf<Scene>();
expectTypeOf(SceneConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Scene.Implementation>>();
expectTypeOf(sceneConfig.options).toEqualTypeOf<DocumentSheet.Options<Scene.Implementation>>();
expectTypeOf(sceneConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(sceneConfig.render(true)).toEqualTypeOf<SceneConfig>();

expectTypeOf(sceneConfig.title).toEqualTypeOf<string>();
