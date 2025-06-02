import { expectTypeOf } from "vitest";

// const gamepadManager = new GamepadManager();

expectTypeOf(GamepadManager.GAMEPAD_POLLER_INTERVAL_MS).toEqualTypeOf<number>();
