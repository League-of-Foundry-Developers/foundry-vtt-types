import { expectTypeOf, test } from "vitest";
import type DetachedWindowManager from "#client/applications/detached/window-manager.d.mts";

declare const manager: DetachedWindowManager;

declare const win: WindowProxy;

declare const target: HTMLElement;

test("foundry/client/applications/detached/window-manager", () => {
  expectTypeOf(foundry.applications.detached).toEqualTypeOf<DetachedWindowManager>();

  expectTypeOf(manager).toEqualTypeOf<DetachedWindowManager>();
  expectTypeOf(manager.focused).toEqualTypeOf<WindowProxy | null>();
  expectTypeOf(manager.windows).toEqualTypeOf<Map<string, DetachedWindowManager.DetachedWindowDescriptor>>();
  expectTypeOf(manager.checkEmpty(win)).toBeVoid();
  expectTypeOf(manager.checkEmpty(null)).toBeVoid();
  expectTypeOf(manager.openWindow()).toEqualTypeOf<Promise<WindowProxy>>();
  expectTypeOf(manager.openWindow({ id: "foo", position: { top: 0 }, timeout: 5000, source: win })).toEqualTypeOf<
    Promise<WindowProxy>
  >();
  expectTypeOf(manager.adoptNodes(target, target)).toBeVoid();
  expectTypeOf(manager.copyAttributes(target, target)).toBeVoid();
  expectTypeOf(manager.copyAttributes(target, target, { attrs: ["class"] })).toBeVoid();
  expectTypeOf(manager.importNodes(target, target)).toBeVoid();
  expectTypeOf(manager.querySelector("div")).toEqualTypeOf<HTMLElement | null>();
  expectTypeOf(manager.querySelectorAll("div")).toEqualTypeOf<HTMLElement[]>();
  expectTypeOf(manager._onWindowClosed(win)).toBeVoid();

  Hooks.on("openDetachedWindow", (id, w) => {
    expectTypeOf(id).toBeString();
    expectTypeOf(w).toEqualTypeOf<WindowProxy>();
  });

  Hooks.on("closeDetachedWindow", (id, w) => {
    expectTypeOf(id).toBeString();
    expectTypeOf(w).toEqualTypeOf<WindowProxy>();
  });
});
