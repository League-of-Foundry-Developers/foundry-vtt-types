import { expectTypeOf } from "vitest";

import HeadsUpDisplayContainer = foundry.applications.hud.HeadsUpDisplayContainer;

declare const container: HeadsUpDisplayContainer;

expectTypeOf(container.token).toEqualTypeOf<foundry.applications.hud.TokenHUD>();
expectTypeOf(container.tile).toEqualTypeOf<foundry.applications.hud.TileHUD>();
expectTypeOf(container.drawing).toEqualTypeOf<foundry.applications.hud.DrawingHUD>();
expectTypeOf(container.bubbles).toEqualTypeOf<foundry.canvas.animation.ChatBubbles>();
expectTypeOf(container.align()).toBeVoid();

expectTypeOf(HeadsUpDisplayContainer.DEFAULT_OPTIONS).toEqualTypeOf<HeadsUpDisplayContainer.DefaultOptions>();
