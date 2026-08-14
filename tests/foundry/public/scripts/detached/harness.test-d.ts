import { expectTypeOf } from "vitest";

declare const detachedWindow: WindowProxy;

expectTypeOf(detachedWindow.id).toEqualTypeOf<string | undefined>();

document.addEventListener("foundry:openChildWindow", (event) => {
  expectTypeOf(event).toEqualTypeOf<OpenChildWindowEvent>();
  expectTypeOf(event.detail).toEqualTypeOf<OpenChildWindowEventDetail>();
  expectTypeOf(event.detail.id).toEqualTypeOf<string>();
  expectTypeOf(event.detail.attrs).toEqualTypeOf<string>();
  expectTypeOf(event.result).toEqualTypeOf<WindowProxy | null | undefined>();

  event.result = window.open("detached/index.html", event.detail.id, event.detail.attrs);
});
