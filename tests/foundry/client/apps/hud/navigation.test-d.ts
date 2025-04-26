import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const sceneNavigation = new SceneNavigation();

expectTypeOf(SceneNavigation.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(sceneNavigation.options).toEqualTypeOf<Application.Options>();
expectTypeOf(sceneNavigation.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(sceneNavigation.render(true)).toEqualTypeOf<SceneNavigation>();

expectTypeOf(sceneNavigation.scenes).toEqualTypeOf<Scene.Implementation[]>();
expectTypeOf(sceneNavigation.expand()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(sceneNavigation.collapse()).toEqualTypeOf<Promise<boolean>>();
