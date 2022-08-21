import { expectAssignable, expectError, expectType } from "tsd";

declare const aGame: Game;

expectType<CombatEncounters | undefined>(aGame.combats);
expectType<Localization>(aGame.i18n);
expectType<ClientSettings>(aGame.settings);

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
/** Convenance type for test, might be worth while moving inside the types */
type Module = Game.ModuleData<foundry.packages.ModuleData>;

expectAssignable<undefined | Module>(aGame.modules.get("optional-module"));

expectType<Module>(aGame.modules.get("required-module"));

const optionalApiModule = aGame.modules.get("optional-api-module");
if (optionalApiModule) {
  expectType<undefined | ModuleConfig["optional-api-module"]["api"]>(optionalApiModule.api);
  if (optionalApiModule.active) {
    expectType<true>(optionalApiModule.active);
    expectType<(value: string) => boolean>(optionalApiModule.api.testApi);
  } else {
    expectType<false>(optionalApiModule.active);
    expectType<undefined>(optionalApiModule.api);
  }
}

const moduleOptionalProps = aGame.modules.get("api-module-with-optional-props");
if (moduleOptionalProps) {
  expectType<undefined | string>(moduleOptionalProps.always);
  expectType<undefined | number>(moduleOptionalProps.maybe);
  if (moduleOptionalProps.active) {
    expectType<string>(moduleOptionalProps.always);
    expectType<undefined | number>(moduleOptionalProps.maybe);
    expectError<number>(moduleOptionalProps.maybe);
  }
}
const requiredApiModule = aGame.modules.get("required-api-module");

expectType<Module & ModuleConfig["required-api-module"]>(requiredApiModule);
expectType<void>(requiredApiModule.hooks.triggerDialog(5));
