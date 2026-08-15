import { expectTypeOf } from "vitest";

import SettingsConfig = foundry.applications.settings.SettingsConfig;
import CategoryBrowser = foundry.applications.api.CategoryBrowser;
import UIConfig = foundry.applications.settings.menus.UIConfig;

const app = new SettingsConfig();

expectTypeOf(SettingsConfig.DEFAULT_OPTIONS).toEqualTypeOf<SettingsConfig.DefaultOptions>();
expectTypeOf(SettingsConfig.reloadConfirm()).toEqualTypeOf<Promise<void>>();
expectTypeOf(SettingsConfig.reloadConfirm({ world: true })).toEqualTypeOf<Promise<void>>();

// A menu entry and a setting entry are told apart by `menu`.
declare const entry: SettingsConfig.Entry;
if (entry.menu) {
  expectTypeOf(entry.buttonText).toBeString();
  expectTypeOf(entry.hint).toBeString();
  expectTypeOf(entry.icon).toBeString();
  expectTypeOf(entry.key).toBeString();
} else {
  expectTypeOf(entry.field).toEqualTypeOf<foundry.data.fields.DataField.Any>();
  expectTypeOf(entry.label).toEqualTypeOf<string | undefined>();
  expectTypeOf(entry.value).toEqualTypeOf<unknown>();
  expectTypeOf(entry.input).toEqualTypeOf<foundry.data.fields.DataField.CustomFormInput | undefined>();
  expectTypeOf(entry.folderPicker).toEqualTypeOf<boolean | undefined>();
}

declare const category: SettingsConfig.Category;
expectTypeOf(category.id).toBeString();
expectTypeOf(category.label).toBeString();

expectTypeOf<globalThis.SettingConfig["core.fonts"]>().toEqualTypeOf<Record<string, CONFIG.Font.FamilyDefinition>>();
expectTypeOf<globalThis.SettingConfig["core.uiConfig"]>().toEqualTypeOf<UIConfig.SettingField>();

class CustomSettingsConfig extends SettingsConfig {
  protected override _categorizeEntry(namespace: string): SettingsConfig.Category {
    return super._categorizeEntry(namespace);
  }

  protected override _prepareCategoryData(): Record<string, CategoryBrowser.CategoryData<SettingsConfig.Entry>> {
    return {};
  }

  testProtected(
    a: CategoryBrowser.CategoryData<SettingsConfig.Entry>,
    b: CategoryBrowser.CategoryData<SettingsConfig.Entry>,
  ): void {
    expectTypeOf(this._sortCategories(a, b)).toBeNumber();
  }
}

expectTypeOf(new CustomSettingsConfig()).toEqualTypeOf<CustomSettingsConfig>();
expectTypeOf(app.search("volume")).toEqualTypeOf<void>();
