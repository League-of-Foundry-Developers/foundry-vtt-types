import { expectTypeOf } from "vitest";

const manager = new PerceptionManager();

expectTypeOf(manager.params).toEqualTypeOf<typeof PerceptionManager.DEFAULTS>();

expectTypeOf(manager.cancel()).toEqualTypeOf<void>();

expectTypeOf(manager.schedule()).toEqualTypeOf<void>();
expectTypeOf(manager.schedule({})).toEqualTypeOf<void>();
expectTypeOf(
  manager.schedule({
    lighting: { initialize: true },
    sight: { initialize: false },
    sounds: { initialize: false },
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  manager.schedule({
    lighting: { initialize: true, refresh: true },
    sight: { initialize: false, refresh: true, skipUpdateFog: true, forceUpdateFog: true },
    sounds: { initialize: false, refresh: false, fade: true },
    foreground: { refresh: true },
  }),
).toEqualTypeOf<void>();

expectTypeOf(manager.update()).toEqualTypeOf<void>();
expectTypeOf(manager.update({})).toEqualTypeOf<void>();
expectTypeOf(
  manager.update({
    lighting: { initialize: true },
    sight: { initialize: false },
    sounds: { initialize: false },
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  manager.update({
    lighting: { initialize: true, refresh: true },
    sight: { initialize: false, refresh: true, skipUpdateFog: true, forceUpdateFog: true },
    sounds: { initialize: false, refresh: false, fade: true },
    foreground: { refresh: true },
  }),
).toEqualTypeOf<void>();

expectTypeOf(manager.initialize()).toEqualTypeOf<void>();

expectTypeOf(manager.refresh()).toEqualTypeOf<void>();
