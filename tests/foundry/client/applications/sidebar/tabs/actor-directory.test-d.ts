import { expectTypeOf, test } from "vitest";

import ActorDirectory = foundry.applications.sidebar.tabs.ActorDirectory;
import Actors = foundry.documents.collections.Actors;
import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const directory: ActorDirectory;

declare const dragEvent: DragEvent;

test("foundry/client/applications/sidebar/tabs/actor-directory", () => {
  expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

  // Widened from the `"actors"` literal so a subclass can occupy its own sidebar tab.
  expectTypeOf(ActorDirectory.tabName).toBeString();

  // Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
  expectTypeOf(directory.collection).toEqualTypeOf<Actors.Implementation>();
  expectTypeOf(directory.documentClass).toEqualTypeOf<Actor.ImplementationClass>();

  expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
  expectTypeOf(directory["_canDragStart"](".directory-item")).toBeBoolean();
  expectTypeOf(directory["_onDragStart"](dragEvent)).toBeVoid();
});
