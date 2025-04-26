import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const scene: Scene.Implementation;
declare const sheet: GridConfig["sheet"];

const gridConfig = new GridConfig(scene, sheet);
expectTypeOf(gridConfig.object).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(GridConfig.defaultOptions).toEqualTypeOf<typeof FormApplication.defaultOptions>();
expectTypeOf(gridConfig.options).toEqualTypeOf<typeof FormApplication.defaultOptions>();
expectTypeOf(gridConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<GridConfig.GridConfigData>>>();
expectTypeOf(gridConfig.render(true)).toEqualTypeOf<GridConfig>();

expectTypeOf(gridConfig.sheet).toEqualTypeOf<SceneConfig>();
