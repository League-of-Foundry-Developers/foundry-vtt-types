import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const app: Application;

expectTypeOf(Application.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(app.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(app.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(app.render(true)).toEqualTypeOf<unknown>();

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
expectTypeOf(app.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(app.close({ force: false })).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.render(true)).toEqualTypeOf<unknown>();
expectTypeOf(app.render(false, { height: "auto" })).toEqualTypeOf<unknown>();
