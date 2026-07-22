import { expectTypeOf } from "vitest";

import ActorDirectory = foundry.applications.sidebar.tabs.ActorDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(ActorDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(ActorDirectory.tabName).toEqualTypeOf<string>();

declare class _TestActorDirectory extends ActorDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _canDragStart(selector: string): boolean;
  protected override _onDragStart(event: DragEvent): void;
}
