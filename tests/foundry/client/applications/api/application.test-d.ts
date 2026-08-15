import { expectTypeOf, test } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

// Regression test for issue where synchronous actions were not being allowed.
// Reported by @ethaks on Discord, see https://discord.com/channels/732325252788387980/793933527065690184/1266523231188422727.
test("synchronous action regression test", () => {
  class _TestApp extends ApplicationV2 {
    static override DEFAULT_OPTIONS = {
      actions: {
        someAction: this.someAction,
      },
    };

    static someAction(): void {
      return;
    }

    eventEmitterTest(context: ApplicationV2.RenderContext, options: ApplicationV2.RenderOptions) {
      const handlerArgs: Parameters<_TestApp["_preFirstRender"]> = [context, options];

      expectTypeOf(
        this._doEvent(this._preFirstRender, { async: true, handlerArgs, debugText: "Before first render" }),
      ).toEqualTypeOf<Promise<void>>();

      expectTypeOf(this._doEvent(this._preFirstRender)).toBeVoid();

      expectTypeOf(this._doEvent(this._preFirstRender, { async: undefined })).toBeVoid();

      expectTypeOf(this._doEvent(this._preFirstRender, { async: false })).toBeVoid();

      this._doEvent(this._getHeaderControls, {
        async: false,
        debugText: "Header Control Buttons",
        hookName: "getHeaderControls",
        hookResponse: true,
      });
    }
  }
});

// Regression test for `DEFAULT_OPTIONS` not being overrideable with unrelated options.
test("unrelated options regression test", () => {
  class _UnrelatedOptions extends ApplicationV2 {
    static override DEFAULT_OPTIONS = { dragDrop: [] };
  }
});

// Regression test for `DeepPartial` not making interfaces partial.
test("regression test interface partial", () => {
  class DeeplyOptional extends ApplicationV2 {
    static override DEFAULT_OPTIONS = {
      window: {
        minimizable: true,
      },
    };
  }

  const deeplyOptional = new DeeplyOptional();

  deeplyOptional.render({
    parts: ["part-name"],
  });
});

declare const applicationV2: foundry.applications.api.ApplicationV2;

expectTypeOf(applicationV2.options).toEqualTypeOf<Readonly<foundry.applications.api.ApplicationV2.Configuration>>();
expectTypeOf(applicationV2.window).toEqualTypeOf<{
  windowId: string | undefined;
  header: HTMLElement | undefined;
  resize: HTMLElement | undefined;
  title: HTMLHeadingElement | undefined;
  icon: HTMLElement | undefined;
  close: HTMLButtonElement | undefined;
  controls: HTMLButtonElement | undefined;
  content: HTMLElement | undefined;
  onDrag: (event: PointerEvent) => void;
  onResize: (event: PointerEvent) => void;
  pointerStartPosition: foundry.applications.api.ApplicationV2.Position | undefined;
  pointerMoveThrottle: boolean;
}>();
expectTypeOf(applicationV2.tabGroups).toEqualTypeOf<Record<string, string | null>>();
expectTypeOf(applicationV2.classList).toEqualTypeOf<DOMTokenList>();
expectTypeOf(applicationV2.id).toEqualTypeOf<string>();
expectTypeOf(applicationV2.title).toEqualTypeOf<string>();
expectTypeOf(applicationV2.element).toEqualTypeOf<HTMLElement>();
expectTypeOf(applicationV2.minimized).toEqualTypeOf<boolean>();
expectTypeOf(applicationV2.position).toEqualTypeOf<foundry.applications.api.ApplicationV2.Position>();
expectTypeOf(applicationV2.rendered).toEqualTypeOf<boolean>();
expectTypeOf(applicationV2.state).toEqualTypeOf<-3 | -2 | -1 | 0 | 1 | 2>();
expectTypeOf(applicationV2.render()).toEqualTypeOf<Promise<foundry.applications.api.ApplicationV2>>();
expectTypeOf(applicationV2.close()).toEqualTypeOf<Promise<foundry.applications.api.ApplicationV2 | void>>();
expectTypeOf(applicationV2.close({ animate: false })).toEqualTypeOf<
  Promise<foundry.applications.api.ApplicationV2 | void>
>();
expectTypeOf(applicationV2.attachWindow()).toEqualTypeOf<Promise<foundry.applications.api.ApplicationV2>>();
expectTypeOf(applicationV2.detachWindow()).toEqualTypeOf<Promise<foundry.applications.api.ApplicationV2>>();
applicationV2.render({ window: { windowId: "detached-window", detached: true } });

declare const position: foundry.applications.api.ApplicationV2.Position;
expectTypeOf(
  applicationV2.setPosition(position),
).toEqualTypeOf<foundry.applications.api.ApplicationV2.Position | void>();
expectTypeOf(applicationV2.minimize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(applicationV2.maximize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(applicationV2.bringToFront()).toEqualTypeOf<void>();
expectTypeOf(applicationV2.changeTab("", "")).toEqualTypeOf<void>();
expectTypeOf(applicationV2["_refit"]()).toEqualTypeOf<void>();
expectTypeOf(applicationV2["_refit"]({ width: "auto" })).toEqualTypeOf<void>();

declare const element: HTMLElement;
expectTypeOf(applicationV2["_insertElement"](element)).toEqualTypeOf<MaybePromise<void>>();
expectTypeOf(applicationV2["_insertElement"](element, { isFirstRender: true })).toEqualTypeOf<MaybePromise<void>>();
expectTypeOf(applicationV2["_tearDown"]({ animate: false })).toEqualTypeOf<void>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(applicationV2["_onChangeForm"](formConfig, event)).toEqualTypeOf<MaybePromise<void>>();

expectTypeOf(ApplicationV2.BASE_APPLICATION).toEqualTypeOf<typeof ApplicationV2>();
expectTypeOf(ApplicationV2.RENDER_STATES).toEqualTypeOf<{
  ERROR: -3;
  CLOSING: -2;
  CLOSED: -1;
  NONE: 0;
  RENDERING: 1;
  RENDERED: 2;
}>();
expectTypeOf(ApplicationV2.emittedEvents).toEqualTypeOf<string[]>();
expectTypeOf(ApplicationV2.inheritanceChain()).toEqualTypeOf<
  Generator<foundry.applications.api.ApplicationV2.AnyConstructor, void, undefined>
>();
expectTypeOf(ApplicationV2.parseCSSDimension("", 1)).toEqualTypeOf<number | undefined>();
// Called on the base class the `this` parameter resolves through the constraint, so the yielded instance is the
// companion's instantiation rather than the bare `ApplicationV2` alias. Spelled out rather than asserted loosely.
expectTypeOf(ApplicationV2.instances()).toEqualTypeOf<
  Generator<
    ApplicationV2<object, ApplicationV2.Configuration<ApplicationV2.Any>, ApplicationV2.RenderOptions>,
    void,
    undefined
  >
>();

// `instances` is polymorphic: a subclass yields itself, not the base.
test("static instances is polymorphic", () => {
  class _InstancesApp extends ApplicationV2 {}

  expectTypeOf(_InstancesApp.instances()).toEqualTypeOf<Generator<_InstancesApp, void, undefined>>();
});

expectTypeOf(applicationV2["_headerControlButtons"]()).toEqualTypeOf<
  Generator<foundry.applications.api.ApplicationV2.HeaderControlsEntry, void, undefined>
>();
expectTypeOf(applicationV2["_headerControlContextEntries"]()).toEqualTypeOf<
  Generator<foundry.applications.ux.ContextMenu.Entry<HTMLElement>, void, undefined>
>();
expectTypeOf(applicationV2["_renderFrameButtons"]({})).toEqualTypeOf<Promise<void>>();

// `target` is only passed when the control is rendered into the header's context menu, so it is
// optional here even though `ContextMenu.EntryCallback` requires it.
expectTypeOf<NonNullable<foundry.applications.api.ApplicationV2.HeaderControlsEntry["onClick"]>>()
  .parameter(1)
  .toEqualTypeOf<HTMLElement | undefined>();
