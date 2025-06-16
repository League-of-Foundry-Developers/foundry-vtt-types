import { expectTypeOf } from "vitest";

import GamepadManager = foundry.helpers.interaction.GamepadManager;

// const gamepadManager = new GamepadManager();

expectTypeOf(GamepadManager.GAMEPAD_POLLER_INTERVAL_MS).toEqualTypeOf<number>();
