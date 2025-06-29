import { expectTypeOf } from "vitest";

import GamepadManager = foundry.helpers.interaction.GamepadManager;

expectTypeOf(GamepadManager.GAMEPAD_POLLER_INTERVAL_MS).toEqualTypeOf<number>();

const gamepadManager = new GamepadManager();

expectTypeOf(gamepadManager["_activateListeners"]()).toBeVoid();
