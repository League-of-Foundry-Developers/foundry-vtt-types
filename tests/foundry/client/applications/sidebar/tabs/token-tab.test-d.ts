import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import TokenTab = foundry.applications.sidebar.tabs.TokenTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: PlaceableDirectory.Any;

const tab = new TokenTab({ collectionName: "tokens", directory });

expectTypeOf(tab).toEqualTypeOf<TokenTab>();

expectTypeOf(TokenTab.DEFAULT_OPTIONS).toEqualTypeOf<TokenTab.DefaultOptions>();
expectTypeOf(TokenTab.DIRECTORY_PARTIAL).toBeString();
expectTypeOf(TokenTab.ENTRY_PARTIAL).toBeString();

declare class _TestTokenTabSubclass extends TokenTab {
  protected override _prepareDirectoryContext(
    context: DeepPartial<TokenTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<TokenTab.RenderContext>;
  protected override _prepareEntry(
    entry: TokenDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<TokenTab.EntryContext>;
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
