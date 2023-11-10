import { expectTypeOf } from "vitest";

const menu = new MainMenu();

expectTypeOf(menu.toggle()).toEqualTypeOf<void>();

const item = menu.items.reload;
if (item) {
  expectTypeOf(item.label).toEqualTypeOf<string>();
  expectTypeOf(item.icon).toEqualTypeOf<string>();
  expectTypeOf(item.enabled).toEqualTypeOf<boolean>();
  expectTypeOf(item.onClick).toEqualTypeOf<() => void>();
}
