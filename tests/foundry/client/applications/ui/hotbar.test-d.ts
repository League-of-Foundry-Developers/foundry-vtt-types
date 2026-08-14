import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const hotbar = new foundry.applications.ui.Hotbar({});

expectTypeOf(hotbar.page).toEqualTypeOf<number>();
expectTypeOf(hotbar.locked).toEqualTypeOf<boolean>();

expectTypeOf(hotbar.slots).toEqualTypeOf<foundry.applications.ui.Hotbar.SlotData[] | undefined>();

if (hotbar.slots?.[0]) {
  expectTypeOf(hotbar.slots[0].macro).toEqualTypeOf<Macro.Implementation | null>();
  expectTypeOf(hotbar.slots[0].img).toEqualTypeOf<string | null>();
}

expectTypeOf(foundry.applications.ui.Hotbar.toggleDocumentSheet("Scene.example")).toEqualTypeOf<
  Promise<void | foundry.applications.ui.Notifications.Notification<"warning">>
>();

class CustomHotbar extends foundry.applications.ui.Hotbar {
  testCreationHelpers(table: RollTable.Implementation, document: foundry.abstract.Document.Any) {
    expectTypeOf(this._createRollTableRollMacro(table)).toEqualTypeOf<Promise<Macro.Implementation | undefined>>();
    expectTypeOf(this._createDocumentSheetToggle(document)).toEqualTypeOf<Promise<Macro.Implementation | undefined>>();
  }
}
expectTypeOf<CustomHotbar>().toExtend<foundry.applications.ui.Hotbar>();

Hooks.on("getMacroContextOptions", (app, contextOptions) => {
  expectTypeOf(app).toEqualTypeOf<
    foundry.applications.ui.Hotbar.Any | foundry.applications.sidebar.tabs.MacroDirectory.Any
  >();
  expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

expectTypeOf(foundry.applications.ui.Hotbar.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(foundry.applications.ui.Hotbar.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
