import { expectTypeOf, test } from "vitest";

import DrawingTab = foundry.applications.sidebar.tabs.DrawingTab;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

declare const entry: DrawingTab.EntryContext;

// Authorless drawings land in a group with neither an id nor a color.
declare const group: DrawingTab.Group;

declare const context: DrawingTab.RenderContext;

test("foundry/client/applications/sidebar/tabs/drawing-tab", () => {
  const tab = new DrawingTab({ collectionName: "drawings", directory });

  expectTypeOf(DrawingTab.DEFAULT_OPTIONS).toEqualTypeOf<DrawingTab.DefaultOptions>();
  expectTypeOf(DrawingTab.DIRECTORY_PARTIAL).toBeString();
  expectTypeOf(tab.collectionName).toBeString();
  expectTypeOf(entry.author).toEqualTypeOf<User.Implementation | null>();
  expectTypeOf(entry.hidden).toBeBoolean();
  expectTypeOf(group.color).toEqualTypeOf<Color | undefined>();
  expectTypeOf(group.id).toEqualTypeOf<string | undefined>();
  expectTypeOf(group.label).toBeString();
  expectTypeOf(group.entries).toEqualTypeOf<DrawingTab.EntryContext[]>();
  expectTypeOf(context.groups).toEqualTypeOf<DrawingTab.Group[] | undefined>();
  expectTypeOf(context.entries).toEqualTypeOf<DrawingTab.EntryContext[] | undefined>();

  class CustomDrawingTab extends DrawingTab {
    protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string {
      return super._getEntryLabel(entry);
    }

    protected override async _prepareEntry(
      entry: PlaceableTab.PlaceableDocument,
      context: PlaceableTab._EntryContext,
    ): Promise<DrawingTab.EntryContext> {
      return super._prepareEntry(entry, context);
    }
  }

  expectTypeOf(new CustomDrawingTab({ collectionName: "drawings", directory })).toEqualTypeOf<CustomDrawingTab>();
});
