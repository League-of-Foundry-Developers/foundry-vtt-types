import { expectType } from "tsd";

const menu = new MainMenu();

expectType<void>(menu.toggle());

const item = menu.items.reload;
if (item) {
  expectType<string>(item.label);
  expectType<string>(item.icon);
  expectType<boolean>(item.enabled);
  expectType<() => void>(item.onClick);
}
