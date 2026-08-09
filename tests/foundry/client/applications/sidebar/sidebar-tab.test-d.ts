import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const tab: AbstractSidebarTab.Any;

expectTypeOf(tab).toExtend<ApplicationV2.Any>();

expectTypeOf(AbstractSidebarTab.tabName).toBeString();
expectTypeOf(AbstractSidebarTab.emittedEvents).toEqualTypeOf<string[]>();

expectTypeOf(tab.active).toBeBoolean();
expectTypeOf(tab.isPopout).toBeBoolean();
expectTypeOf(tab.tabName).toBeString();

// A `WeakRef` backs this, so it drops back to `undefined` once the popout is closed and collected.
expectTypeOf(tab.popout).toEqualTypeOf<AbstractSidebarTab.Any | undefined>();

expectTypeOf(tab.activate()).toBeVoid();
expectTypeOf(tab.renderPopout()).toEqualTypeOf<Promise<AbstractSidebarTab.Any>>();

declare const context: DeepPartial<AbstractSidebarTab.RenderContext>;
declare const options: DeepPartial<AbstractSidebarTab.RenderOptions>;

expectTypeOf(tab["_onActivate"]()).toBeVoid();
expectTypeOf(tab["_onDeactivate"]()).toBeVoid();
expectTypeOf(tab["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tab["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();

// Synchronous at runtime, but kept at the base's `MaybePromise<void>` so concrete tabs may override
// it with an async implementation.
expectTypeOf(tab["_onClose"](options)).toEqualTypeOf<MaybePromise<void>>();

// `_prepareContext` adds `user` to the shared application context.
expectTypeOf<AbstractSidebarTab.RenderContext["user"]>().toEqualTypeOf<User.Stored>();

// The runtime builds this as `[...super.emittedEvents, "activate", "deactivate"]`.
expectTypeOf<AbstractSidebarTab.EmittedEvents>().toEqualTypeOf<
  [...ApplicationV2.EmittedEvents, "activate", "deactivate"]
>();
