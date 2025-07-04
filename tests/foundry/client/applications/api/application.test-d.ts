import { expectTypeOf, test } from "vitest";

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
  header?: HTMLElement | undefined;
  resize?: HTMLElement | undefined;
  title: HTMLHeadingElement | undefined;
  icon: HTMLElement | undefined;
  close: HTMLButtonElement | undefined;
  controls: HTMLButtonElement | undefined;
  controlsDropdown: HTMLDivElement | undefined;
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
expectTypeOf(applicationV2.close()).toEqualTypeOf<Promise<foundry.applications.api.ApplicationV2>>();

declare const position: foundry.applications.api.ApplicationV2.Position;
expectTypeOf(
  applicationV2.setPosition(position),
).toEqualTypeOf<foundry.applications.api.ApplicationV2.Position | void>();
expectTypeOf(applicationV2.toggleControls()).toEqualTypeOf<Promise<void>>();
expectTypeOf(applicationV2.minimize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(applicationV2.maximize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(applicationV2.bringToFront()).toEqualTypeOf<void>();
expectTypeOf(applicationV2.changeTab("", "")).toEqualTypeOf<void>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(applicationV2["_onChangeForm"](formConfig, event)).toEqualTypeOf<void>();

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
expectTypeOf(ApplicationV2.parseCSSDimensions("", 1)).toEqualTypeOf<number | undefined>();
