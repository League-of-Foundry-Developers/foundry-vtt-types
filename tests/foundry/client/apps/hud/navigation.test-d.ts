import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/utils/index.d.mts";

const sceneNavigation = new SceneNavigation();

expectTypeOf(SceneNavigation.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(sceneNavigation.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(sceneNavigation.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(sceneNavigation.render(true)).toEqualTypeOf<SceneNavigation | void>();

expectTypeOf(sceneNavigation.scenes).toEqualTypeOf<Scene.ConfiguredInstance[]>();
expectTypeOf(sceneNavigation.expand()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(sceneNavigation.collapse()).toEqualTypeOf<Promise<boolean>>();
