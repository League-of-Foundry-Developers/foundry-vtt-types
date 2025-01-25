import { expectTypeOf } from "vitest";

const settings = new Settings();

expectTypeOf(Settings.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(settings.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(settings.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(settings.render(true)).toEqualTypeOf<Settings>();
expectTypeOf(settings.createPopout()).toEqualTypeOf<Settings>();
