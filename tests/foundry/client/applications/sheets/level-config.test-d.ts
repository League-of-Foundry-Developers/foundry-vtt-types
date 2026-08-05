import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import LevelConfig = foundry.applications.sheets.LevelConfig;

declare const doc: Level.Implementation;
const levelConfig = new LevelConfig({ document: doc });

expectTypeOf(levelConfig.document).toEqualTypeOf<Level.Implementation>();

expectTypeOf(LevelConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(LevelConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const context: LevelConfig.RenderContext;
expectTypeOf(context.gridUnits).toBeString();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
expectTypeOf(context.otherLevels).toEqualTypeOf<LevelConfig.LevelChoice[] | undefined>();
expectTypeOf(context.textureFitModes).toEqualTypeOf<Record<CONST.TEXTURE_DATA_FIT_MODES, string>>();

class CustomLevelConfig extends LevelConfig {
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<Level.Implementation>,
  ): DocumentSheetV2.SubmitData<Level.Implementation> {
    return super._prepareSubmitData(event, form, formData, updateData);
  }
}

expectTypeOf(CustomLevelConfig).toExtend<LevelConfig.AnyConstructor>();
