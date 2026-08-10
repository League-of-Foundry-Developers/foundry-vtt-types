import { expectTypeOf } from "vitest";

import TokenTab = foundry.applications.sidebar.tabs.TokenTab;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new TokenTab({ collectionName: "tokens", directory });

expectTypeOf(TokenTab.DEFAULT_OPTIONS).toEqualTypeOf<TokenTab.DefaultOptions>();
expectTypeOf(TokenTab.DIRECTORY_PARTIAL).toBeString();
expectTypeOf(TokenTab.ENTRY_PARTIAL).toBeString();
expectTypeOf(tab.collectionName).toBeString();

declare const entry: TokenTab.EntryContext;
expectTypeOf(entry.levelId).toBeString();

// Tokens on no known level land in a group without an id.
declare const group: TokenTab.Group;
expectTypeOf(group.id).toEqualTypeOf<string | undefined>();
expectTypeOf(group.entries).toEqualTypeOf<TokenTab.EntryContext[]>();

// Only grouped when the Scene has more than one level.
declare const context: TokenTab.RenderContext;
expectTypeOf(context.groups).toEqualTypeOf<TokenTab.Group[] | undefined>();

class CustomTokenTab extends TokenTab {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[] {
    return super._getEntryContextOptions();
  }

  protected override async _prepareDirectoryContext(
    context: TokenTab.RenderContext,
    options: TokenTab.RenderOptions,
  ): Promise<TokenTab.RenderContext> {
    return super._prepareDirectoryContext(context, options);
  }

  protected override async _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<TokenTab.EntryContext> {
    return super._prepareEntry(entry, context);
  }
}

expectTypeOf(new CustomTokenTab({ collectionName: "tokens", directory })).toEqualTypeOf<CustomTokenTab>();
