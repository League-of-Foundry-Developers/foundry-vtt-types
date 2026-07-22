import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const directory: PlaceableDirectory;

expectTypeOf(directory.tab).toEqualTypeOf<PlaceableTab.Any | undefined>();

declare const object: foundry.canvas.placeables.PlaceableObject.Any;
expectTypeOf(directory.hoverEntry(object, true)).toBeVoid();
expectTypeOf(directory.isEntryVisible(object)).toBeBoolean();
expectTypeOf(directory._updateFilterPip()).toBeVoid();
expectTypeOf(directory.close()).toEqualTypeOf<Promise<PlaceableDirectory | void>>();

expectTypeOf(PlaceableDirectory.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableDirectory.DefaultOptions>();
expectTypeOf(PlaceableDirectory.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(PlaceableDirectory.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(PlaceableDirectory.tabName).toBeString();

declare class _TestPlaceableDirectorySubclass extends PlaceableDirectory {
  protected override _canRender(options: DeepPartial<PlaceableDirectory.RenderOptions>): false | void;
  protected override _onRender(
    context: DeepPartial<PlaceableDirectory.RenderContext>,
    options: DeepPartial<PlaceableDirectory.RenderOptions>,
  ): Promise<void>;
  protected override _prepareContext(
    options: DeepPartial<PlaceableDirectory.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PlaceableDirectory.RenderContext>;
  protected override _onActivate(): void;
  protected override _onDeactivate(): void;
  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;
}
