import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const wallDoc: WallDocument.Implementation;
const wallConfig = new WallConfig(wallDoc);

expectTypeOf(wallConfig.object).toEqualTypeOf<WallDocument.Implementation>();
expectTypeOf(wallConfig.document).toEqualTypeOf<WallDocument.Implementation>();
expectTypeOf(WallConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<WallDocument.Implementation>>();
expectTypeOf(wallConfig.options).toEqualTypeOf<DocumentSheet.Options<WallDocument.Implementation>>();
expectTypeOf(wallConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(wallConfig.render(true)).toEqualTypeOf<WallConfig>();

expectTypeOf(wallConfig.editTargets).toEqualTypeOf<string[]>();
expectTypeOf(wallConfig.title).toEqualTypeOf<string>();
