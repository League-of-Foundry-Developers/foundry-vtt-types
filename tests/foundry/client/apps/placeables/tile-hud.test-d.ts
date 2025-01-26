import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";
import type { Container, DisplayObject } from "pixi.js";

const tileHUD = new TileHUD();

expectTypeOf(tileHUD.object).toEqualTypeOf<Tile | undefined>();
expectTypeOf(TileHUD.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(tileHUD.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(tileHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(tileHUD.render(true)).toEqualTypeOf<TileHUD>();

expectTypeOf(tileHUD.layer).toEqualTypeOf<Container<DisplayObject> | undefined>();
