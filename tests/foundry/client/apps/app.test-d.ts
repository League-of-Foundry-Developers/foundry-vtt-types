import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

expectTypeOf(Application.defaultOptions).toEqualTypeOf<ApplicationOptions>();

const app = new (class extends Application {})();
expectTypeOf(app.id).toEqualTypeOf<string>();
expectTypeOf(app.element).toEqualTypeOf<JQuery>();
expectTypeOf(app.appId).toEqualTypeOf<number>();
expectTypeOf(app.popOut).toEqualTypeOf<boolean>();
expectTypeOf(app.template).toEqualTypeOf<string>();
expectTypeOf(app.title).toEqualTypeOf<string>();
expectTypeOf(app.rendered).toEqualTypeOf<boolean>();

expectTypeOf(app.bringToTop()).toEqualTypeOf<void>();
expectTypeOf(app.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(app.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(app.close({ force: false })).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(app.render()).toEqualTypeOf<unknown>();
expectTypeOf(app.render(true)).toEqualTypeOf<unknown>();
expectTypeOf(app.render(false, { height: "auto" })).toEqualTypeOf<unknown>();
