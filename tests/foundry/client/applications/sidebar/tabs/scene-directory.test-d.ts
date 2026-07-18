import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import SceneDirectory = foundry.applications.sidebar.tabs.SceneDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(SceneDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(SceneDirectory.tabName).toEqualTypeOf<string>();

declare class _TestSceneDirectory extends SceneDirectory {
  protected override _canRender(options: DeepPartial<SceneDirectory.RenderOptions>): false | void;
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
