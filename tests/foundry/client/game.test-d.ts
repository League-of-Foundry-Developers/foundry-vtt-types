import { expectTypeOf, assertType } from "vitest";

declare const aGame: Game;

expectTypeOf(aGame.combats).toEqualTypeOf<CombatEncounters | undefined>();
expectTypeOf(aGame.i18n).toEqualTypeOf<Localization>();
expectTypeOf(aGame.settings).toEqualTypeOf<ClientSettings>();

declare global {
  interface ModuleConfig {
    "optional-api-module": {
      api: {
        testApi: (value: string) => boolean;
      };
    };
    "api-module-with-optional-props": {
      always: string;
      maybe?: number;
    };
    "required-api-module": {
      hooks: {
        triggerDialog: (value: number) => void;
      };
    };
  }
  interface RequiredModules {
    "required-module": true;
    "required-api-module": true;
  }
}

assertType<undefined | Module>(aGame.modules.get("optional-module"));

expectTypeOf(aGame.modules.get("required-module")).toEqualTypeOf<Module>();

const optionalApiModule = aGame.modules.get("optional-api-module");
if (optionalApiModule) {
  expectTypeOf(optionalApiModule.api).toEqualTypeOf<undefined | ModuleConfig["optional-api-module"]["api"]>();
  if (optionalApiModule.active) {
    expectTypeOf(optionalApiModule.active).toEqualTypeOf<true>();
    expectTypeOf(optionalApiModule.api.testApi).toEqualTypeOf<(value: string) => boolean>();
  } else {
    expectTypeOf(optionalApiModule.active).toEqualTypeOf<false>();
    expectTypeOf(optionalApiModule.api).toEqualTypeOf<undefined>();
  }
}

const moduleOptionalProps = aGame.modules.get("api-module-with-optional-props");
if (moduleOptionalProps) {
  expectTypeOf(moduleOptionalProps.always).toEqualTypeOf<undefined | string>();
  expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<undefined | number>();
  if (moduleOptionalProps.active) {
    expectTypeOf(moduleOptionalProps.always).toEqualTypeOf<string>();
    expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<undefined | number>();
    // @ts-expect-error - number would the entirely wrong type.
    expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<number>();
  }
}
const requiredApiModule = aGame.modules.get("required-api-module");

expectTypeOf(requiredApiModule).toEqualTypeOf<Module & ModuleConfig["required-api-module"]>();
expectTypeOf(requiredApiModule.hooks.triggerDialog(5)).toEqualTypeOf<void>();
