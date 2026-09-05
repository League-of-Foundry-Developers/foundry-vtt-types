import { expectTypeOf } from "vitest";
import MouseManager = foundry.helpers.interaction.MouseManager;

const mouseManager = new MouseManager();

expectTypeOf(mouseManager["_activateListeners"]()).toBeVoid();
