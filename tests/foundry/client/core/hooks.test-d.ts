import { expectTypeOf } from "vitest";

expectTypeOf(Hooks.events).toEqualTypeOf<Hooks.HookedFunction[]>();
expectTypeOf(Hooks.on("", () => {})).toEqualTypeOf<number>();
expectTypeOf(Hooks.once("", () => {})).toEqualTypeOf<number>();
expectTypeOf(Hooks.off("", () => {})).toEqualTypeOf<void>();
expectTypeOf(Hooks.callAll("")).toEqualTypeOf<true>();
expectTypeOf(Hooks.call("")).toEqualTypeOf<boolean>();
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
Hooks.on<Hooks.CloseApplication<FormApplication>>("closeFormApplication", (app, jq) => {
  expectTypeOf(app).toEqualTypeOf<FormApplication>();
  expectTypeOf(jq).toEqualTypeOf<JQuery>();
});

Hooks.on("error", (...args) => {
  if (args[0] === "Canvas#draw") expectTypeOf(args[2].layer).toEqualTypeOf<CanvasLayer>();
});
Hooks.on("error", (...args) => {
  if (args[0] === "Game#initializeCanvas") expectTypeOf(args[2].foo).toEqualTypeOf<never>();
});
// TODO: Clean up as part of revised hooks file
// Hooks.on("error", (...args) => {
//   if (args[0] === "MyClass#myMethod") expectTypeOf(args[2].foo).toEqualTypeOf<number>();
// });

// Test for @peril_maelstrom on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1377367755338289223
Hooks.on("deleteToken", (document, options) => {
  expectTypeOf(document).toEqualTypeOf<TokenDocument.Implementation>();
  expectTypeOf(options.parent).toEqualTypeOf<TokenDocument.Parent | undefined>();
});
