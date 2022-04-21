import { expectType } from 'tsd';

const manager = new PerceptionManager();

expectType<typeof PerceptionManager.DEFAULTS>(manager.params);

expectType<void>(manager.cancel());

expectType<void>(manager.schedule());
expectType<void>(manager.schedule({}));
expectType<void>(
  manager.schedule({
    lighting: { initialize: true },
    sight: { initialize: false },
    sounds: { initialize: false }
  })
);
expectType<void>(
  manager.schedule({
    lighting: { initialize: true, refresh: true },
    sight: { initialize: false, refresh: true, skipUpdateFog: true, forceUpdateFog: true },
    sounds: { initialize: false, refresh: false, fade: true },
    foreground: { refresh: true }
  })
);

expectType<void>(manager.update());
expectType<void>(manager.update({}));
expectType<void>(
  manager.update({
    lighting: { initialize: true },
    sight: { initialize: false },
    sounds: { initialize: false }
  })
);
expectType<void>(
  manager.update({
    lighting: { initialize: true, refresh: true },
    sight: { initialize: false, refresh: true, skipUpdateFog: true, forceUpdateFog: true },
    sounds: { initialize: false, refresh: false, fade: true },
    foreground: { refresh: true }
  })
);

expectType<void>(manager.initialize());

expectType<void>(manager.refresh());
