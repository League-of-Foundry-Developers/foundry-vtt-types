import { expectTypeOf } from "vitest";

// const mouseManager = new MouseManager();

expectTypeOf(MouseManager.MOUSE_WHEEL_RATE_LIMIT).toEqualTypeOf<number>();
