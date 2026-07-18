import { expectTypeOf } from "vitest";
import type DetachedWindowManager from "#client/applications/detached/window-manager.d.mts";

declare const manager: DetachedWindowManager;

expectTypeOf(foundry.applications.detached).toEqualTypeOf<DetachedWindowManager>();

expectTypeOf(manager).toEqualTypeOf<DetachedWindowManager>();
expectTypeOf(manager.focused).toEqualTypeOf<WindowProxy | null>();
expectTypeOf(manager.windows).toEqualTypeOf<Map<string, DetachedWindowManager.DetachedWindowDescriptor>>();

declare const win: WindowProxy;
expectTypeOf(manager.checkEmpty(win)).toBeVoid();
expectTypeOf(manager.checkEmpty(null)).toBeVoid();
expectTypeOf(manager.openWindow()).toEqualTypeOf<Promise<WindowProxy>>();
expectTypeOf(manager.openWindow({ id: "foo", position: { top: 0 }, timeout: 5000, source: win })).toEqualTypeOf<
  Promise<WindowProxy>
>();

declare const target: HTMLElement;
expectTypeOf(manager.adoptNodes(target, target)).toBeVoid();
expectTypeOf(manager.copyAttributes(target, target)).toBeVoid();
expectTypeOf(manager.copyAttributes(target, target, { attrs: ["class"] })).toBeVoid();
expectTypeOf(manager.importNodes(target, target)).toBeVoid();
expectTypeOf(manager.querySelector("div")).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(manager.querySelectorAll("div")).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(manager._onWindowClosed(win)).toBeVoid();
