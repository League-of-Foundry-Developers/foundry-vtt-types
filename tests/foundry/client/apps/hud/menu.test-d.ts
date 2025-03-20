import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const menu = new MainMenu();

expectTypeOf(MainMenu.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(menu.options).toEqualTypeOf<Application.Options>();
expectTypeOf(menu.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(menu.render(true)).toEqualTypeOf<MainMenu>();

expectTypeOf(menu.items).toEqualTypeOf<MainMenu.MenuStructure>();
expectTypeOf(menu.toggle()).toEqualTypeOf<void>();

const item = menu.items.reload;
if (item) {
  expectTypeOf(item.label).toEqualTypeOf<string>();
  expectTypeOf(item.icon).toEqualTypeOf<string>();
  expectTypeOf(item.enabled).toEqualTypeOf<boolean>();
  expectTypeOf(item.onClick).toEqualTypeOf<() => void>();
}
