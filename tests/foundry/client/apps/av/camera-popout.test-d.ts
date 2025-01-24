import { expectTypeOf } from "vitest";

const view = ui.webrtc as CameraViews;
const popout = new CameraPopoutAppWrapper(view, "123", $("<div></div>"));

expectTypeOf(popout.view).toEqualTypeOf<CameraViews>();
expectTypeOf(popout.element).toEqualTypeOf<JQuery>();
expectTypeOf(popout.userId).toEqualTypeOf<string>();
expectTypeOf(popout.popOut).toEqualTypeOf<boolean>();
expectTypeOf(popout.options).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(popout.position).toEqualTypeOf<Application.Position>();

expectTypeOf(popout.setPosition()).toEqualTypeOf<(Application.Position & { height: number }) | void>();
