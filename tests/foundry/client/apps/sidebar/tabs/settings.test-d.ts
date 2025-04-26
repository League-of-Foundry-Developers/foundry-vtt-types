import { expectTypeOf } from "vitest";

const settings = new Settings();

expectTypeOf(Settings.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(settings.options).toEqualTypeOf<Application.Options>();
expectTypeOf(settings.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(settings.render(true)).toEqualTypeOf<Settings>();
expectTypeOf(settings.createPopout()).toEqualTypeOf<Settings>();
