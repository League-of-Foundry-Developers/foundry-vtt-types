import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import DiceConfig = foundry.applications.settings.menus.DiceConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const app = new DiceConfig();

expectTypeOf(DiceConfig.DEFAULT_OPTIONS).toEqualTypeOf<DiceConfig.DefaultOptions>();
expectTypeOf(DiceConfig.registerSetting()).toEqualTypeOf<void>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(DiceConfig.SETTING).toEqualTypeOf<"diceConfiguration">();

declare const context: DiceConfig.RenderContext;
expectTypeOf(context.methods).toEqualTypeOf<DiceConfig.MethodContext[]>();
expectTypeOf(context.defaultMethod).toBeString();
expectTypeOf(context.dice).toEqualTypeOf<DiceConfig.DenominationContext[]>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

declare const denomination: DiceConfig.DenominationContext;
expectTypeOf(denomination.label).toBeString();
expectTypeOf(denomination.icon).toBeString();
expectTypeOf(denomination.denomination).toBeString();
expectTypeOf(denomination.method).toBeString();

class CustomDiceConfig extends DiceConfig {
  protected override async _prepareContext(
    options: DeepPartial<DiceConfig.RenderOptions> & { isFirstRender: boolean },
  ): Promise<DiceConfig.RenderContext> {
    return super._prepareContext(options);
  }
}

expectTypeOf(new CustomDiceConfig()).toEqualTypeOf<CustomDiceConfig>();
expectTypeOf(app.render()).toEqualTypeOf<Promise<DiceConfig>>();
