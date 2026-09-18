import { expectTypeOf, test } from "vitest";
import MouseManager = foundry.helpers.interaction.MouseManager;

test("foundry/client/helpers/interaction/mouse-manager", () => {
  const mouseManager = new MouseManager();

  expectTypeOf(mouseManager["_activateListeners"]()).toBeVoid();
});
