import { expectTypeOf } from "vitest";

// const mouseManager = new MouseManager();

expectTypeOf(foundry.helpers.interaction.MouseManager.MOUSE_WHEEL_RATE_LIMIT).toEqualTypeOf<number>();
