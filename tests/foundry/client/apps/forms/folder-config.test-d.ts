import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const folder: Folder;

const folderConfig = new FolderConfig(folder);
expectTypeOf(folderConfig.object).toEqualTypeOf<Folder>();
expectTypeOf(folderConfig.document).toEqualTypeOf<Folder>();
expectTypeOf(FolderConfig.defaultOptions).toEqualTypeOf<FolderConfig.Options>();
expectTypeOf(folderConfig.options).toEqualTypeOf<FolderConfig.Options>();
expectTypeOf(folderConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<FolderConfig.FolderConfigData>>>();
expectTypeOf(folderConfig.render(true)).toEqualTypeOf<FolderConfig>();

expectTypeOf(folderConfig.id).toEqualTypeOf<string>();
expectTypeOf(folderConfig.title).toEqualTypeOf<string>();
