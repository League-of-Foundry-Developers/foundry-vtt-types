import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const wallDoc: WallDocument;
const wallConfig = new WallConfig(wallDoc);

expectTypeOf(wallConfig.object).toEqualTypeOf<WallDocument>();
expectTypeOf(wallConfig.document).toEqualTypeOf<WallDocument>();
expectTypeOf(WallConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<WallDocument.Implementation>>();
expectTypeOf(wallConfig.options).toEqualTypeOf<DocumentSheet.Options<WallDocument.Implementation>>();
expectTypeOf(wallConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(wallConfig.render(true)).toEqualTypeOf<WallConfig>();

expectTypeOf(wallConfig.editTargets).toEqualTypeOf<string[]>();
expectTypeOf(wallConfig.title).toEqualTypeOf<string>();
