import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

class D20Roll<D extends AnyObject> extends Roll<D> {}

declare global {
  namespace CONFIG {
    interface Dice {
      D20Roll: typeof D20Roll;
    }
  }
}

declare const placeableTabConfiguration: PlaceableTab.Configuration<PlaceableTab.Any>;

test("foundry/client/config", () => {
  CONFIG.Dice.D20Roll = D20Roll;

  const d20roll = new CONFIG.Dice.D20Roll("1d20");

  d20roll.evaluate();

  expectTypeOf(CONFIG.AmbientLight.sidebar.applicationClass).toEqualTypeOf<
    typeof foundry.applications.sidebar.tabs.AmbientLightTab
  >();
  expectTypeOf(CONFIG.AmbientLight.sidebar.order).toEqualTypeOf<number | undefined>();
  expectTypeOf(CONFIG.ui.placeables).toEqualTypeOf<typeof foundry.applications.sidebar.tabs.PlaceableDirectory>();
  expectTypeOf(placeableTabConfiguration.collectionName).toEqualTypeOf<
    foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument["collectionName"]
  >();
});
