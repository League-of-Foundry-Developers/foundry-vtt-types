import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

import Application = foundry.appv1.api.Application;

declare const app: Application;

expectTypeOf(Application.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(app.options).toEqualTypeOf<Application.Options>();
expectTypeOf(app.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(app.render(true)).toEqualTypeOf<Application>();

expectTypeOf(app.appId).toEqualTypeOf<number>();
expectTypeOf(app.position).toEqualTypeOf<Application.Position>();
expectTypeOf(app.id).toEqualTypeOf<string>();
expectTypeOf(app.element).toEqualTypeOf<JQuery>();
expectTypeOf(app.template).toEqualTypeOf<string>();
expectTypeOf(app.popOut).toEqualTypeOf<boolean>();
expectTypeOf(app.rendered).toEqualTypeOf<boolean>();
expectTypeOf(app.closing).toEqualTypeOf<boolean>();
expectTypeOf(app.title).toEqualTypeOf<string>();

expectTypeOf(app.bringToTop()).toEqualTypeOf<void>();
expectTypeOf(app.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(app.options).toEqualTypeOf<Application.Options>();
expectTypeOf(app.close({ force: false })).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.render(true)).toEqualTypeOf<Application>();
expectTypeOf(app.render(false, { height: "auto" })).toEqualTypeOf<Application>();

Hooks.on("renderApplication", (app, html, data) => {
  expectTypeOf(app).toEqualTypeOf<Application>();
  expectTypeOf(html).toEqualTypeOf<JQuery>();
  expectTypeOf(data).toEqualTypeOf<object>();
});
