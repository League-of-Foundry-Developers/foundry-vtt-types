import { expectTypeOf } from "vitest";

import ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const doc: ActiveEffect.Implementation;
const effectConfig = new ActiveEffectConfig({ document: doc });

expectTypeOf(effectConfig.document).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(ActiveEffectConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(ActiveEffectConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: ActiveEffectConfig.RenderContext;
expectTypeOf(context.isActorEffect).toEqualTypeOf<boolean | undefined>();
expectTypeOf(context.statuses).toEqualTypeOf<ActiveEffectConfig.StatusChoice[] | undefined>();
expectTypeOf(context.showIconOptions).toEqualTypeOf<ActiveEffectConfig.ShowIconChoice[] | undefined>();
expectTypeOf(context.durationUnits).toEqualTypeOf<ActiveEffectConfig.DurationUnitChoice[] | undefined>();
expectTypeOf(context.expiryEvents).toEqualTypeOf<Record<string, string> | undefined>();
expectTypeOf(context.changes).toEqualTypeOf<string[] | undefined>();
expectTypeOf(context.start).toEqualTypeOf<ActiveEffectConfig.StartContext | null | undefined>();

declare const changeContext: ActiveEffectConfig.RenderChangeContext;
expectTypeOf(changeContext.changeType).toEqualTypeOf<ActiveEffect.ChangeTypeConfig | undefined>();

declare const startContext: ActiveEffectConfig.StartContext;
expectTypeOf(startContext.initiative).toEqualTypeOf<number | null>();
expectTypeOf(startContext.round).toEqualTypeOf<number | null>();
expectTypeOf(startContext.turn).toEqualTypeOf<number | null>();
expectTypeOf(startContext.time).toEqualTypeOf<string>();
expectTypeOf(startContext.combat).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(startContext.combatant).toEqualTypeOf<Combatant.Implementation | null>();
expectTypeOf(startContext.combatantInitiative).toEqualTypeOf<number | string>();
class CustomActiveEffectConfig extends ActiveEffectConfig {
  protected override _renderChange(renderContext: ActiveEffectConfig.RenderChangeContext): Promise<string> {
    return super._renderChange(renderContext);
  }

  protected override _prepareStartContext(): Promise<ActiveEffectConfig.StartContext | null> {
    return super._prepareStartContext();
  }

  protected override _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void {
    super._processChangeSubmission(change, index);
  }
}

expectTypeOf(CustomActiveEffectConfig).toExtend<ActiveEffectConfig.AnyConstructor>();
