import { expectTypeOf, test } from "vitest";

import GamepadManager = foundry.helpers.interaction.GamepadManager;

test("foundry/client/helpers/interaction/gamepad-manager", () => {
  expectTypeOf(GamepadManager.GAMEPAD_POLLER_INTERVAL_MS).toEqualTypeOf<number>();

  const gamepadManager = new GamepadManager();

  expectTypeOf(gamepadManager["_activateListeners"]()).toBeVoid();
});
