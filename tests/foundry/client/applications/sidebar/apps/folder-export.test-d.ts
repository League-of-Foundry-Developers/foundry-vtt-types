import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import DialogV2 = foundry.applications.api.DialogV2;
import FolderExport = foundry.applications.sidebar.apps.FolderExport;

declare const folderExport: FolderExport;

expectTypeOf(folderExport).toExtend<DialogV2.Any>();

declare const context: DeepPartial<FolderExport.RenderContext>;
declare const options: DeepPartial<FolderExport.RenderOptions>;

expectTypeOf(folderExport["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();

expectTypeOf<FolderExport.Configuration["buttons"]>().toEqualTypeOf<DialogV2.Button<FolderExport.Any>[]>();
