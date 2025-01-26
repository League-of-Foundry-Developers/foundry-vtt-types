import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

if (game instanceof Game) {
  game.settings.register("core", "diceConfiguration", {
    config: false,
    default: {},
    type: Object,
    scope: "client",
  });

  game.settings.registerMenu("core", "diceConfiguration", {
    name: "DICE.CONFIG.Title",
    label: "DICE.CONFIG.Label",
    hint: "DICE.CONFIG.Hint",
    icon: "fas fa-dice-d20",
    type: DiceConfig,
    restricted: false,
  });
}

const diceConfig = new DiceConfig({ name: "foo" });

expectTypeOf(DiceConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(diceConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<DiceConfig.DiceConfigData>>>();
expectTypeOf(diceConfig.render(true)).toEqualTypeOf<DiceConfig>();
