import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

import MainMenu = foundry.applications.ui.MainMenu;

const mainMenu = new MainMenu({});

expectTypeOf(MainMenu.ITEMS).toEqualTypeOf<Record<string, MainMenu.MainMenuItem>>();
expectTypeOf(mainMenu.items).toEqualTypeOf<Record<string, MainMenu.MainMenuItem>>();
expectTypeOf(mainMenu.toggle()).toEqualTypeOf<Promise<void>>();

// A registered item is invoked as `onClick.call(menu, event)`, so `this` is the menu itself.
MainMenu.ITEMS["custom"] = {
  label: "Example",
  icon: "fa-solid fa-circle",
  enabled: true,
  onClick(event) {
    expectTypeOf(this).toEqualTypeOf<MainMenu.Any>();
    expectTypeOf(event).toEqualTypeOf<PointerEvent>();
    this.close();
  },
};

expectTypeOf(mainMenu["_insertElement"](document.createElement("div"))).toEqualTypeOf<MaybePromise<void>>();
