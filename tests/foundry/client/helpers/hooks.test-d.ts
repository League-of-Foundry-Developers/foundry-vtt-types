import type { EmptyObject } from "#utils";
import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import FormApplication = foundry.appv1.api.FormApplication;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;

expectTypeOf(foundry.helpers.Hooks.events).toEqualTypeOf<Record<string, Hooks.HookedFunction[]>>();
expectTypeOf(Hooks.on("ready", () => {})).toEqualTypeOf<number>();
expectTypeOf(Hooks.once("ready", () => {})).toEqualTypeOf<number>();
expectTypeOf(Hooks.off("ready", () => {})).toEqualTypeOf<void>();
expectTypeOf(Hooks.callAll("ready")).toEqualTypeOf<true>();
expectTypeOf(Hooks.call("ready")).toEqualTypeOf<boolean>();
expectTypeOf(Hooks.onError("", new Error(""))).toEqualTypeOf<void>();

Hooks.on("canvasInit", (canvas) => {
  expectTypeOf(canvas).toEqualTypeOf<Canvas>();
});

// TODO: Clean up as part of revised hooks file
// Hooks.on("fooBar", (baz, bar) => {
//   expectTypeOf(baz).toEqualTypeOf<string>();
//   expectTypeOf(bar).toEqualTypeOf<number>();
//   return true;
// });

Hooks.on("closeFormApplication", (app, jq) => {
  expectTypeOf(app).toEqualTypeOf<FormApplication.Any>();
  expectTypeOf(jq).toEqualTypeOf<JQuery>();
});

Hooks.on("error", (location, _err, data) => {
  if (location === "Canvas#draw") expectTypeOf(data.layer).toEqualTypeOf<CanvasLayer>();
  if (location === "Game#initializeCanvas") expectTypeOf(data).toEqualTypeOf<EmptyObject>();
  if (location === "MyClass#myMethod") expectTypeOf(data.foo).toEqualTypeOf<number>();
});

// Test for @peril_maelstrom on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1377367755338289223
Hooks.on("deleteToken", (document, options) => {
  expectTypeOf(document).toEqualTypeOf<TokenDocument.Implementation>();
  expectTypeOf(options.parent).toEqualTypeOf<TokenDocument.Parent | undefined>();
});
