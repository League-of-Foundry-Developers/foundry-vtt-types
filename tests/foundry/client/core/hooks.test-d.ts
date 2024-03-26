import { expectTypeOf } from "vitest";

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
