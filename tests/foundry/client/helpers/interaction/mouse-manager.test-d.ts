import { expectTypeOf } from "vitest";
import MouseManager = foundry.helpers.interaction.MouseManager;

expectTypeOf(MouseManager.MOUSE_WHEEL_RATE_LIMIT).toEqualTypeOf<number>();

const mouseManager = new MouseManager();

expectTypeOf(mouseManager["_activateListeners"]()).toBeVoid();
