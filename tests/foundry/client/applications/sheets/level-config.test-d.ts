import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import LevelConfig = foundry.applications.sheets.LevelConfig;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const config: LevelConfig;

expectTypeOf(config).toEqualTypeOf<LevelConfig>();

expectTypeOf(LevelConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(LevelConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestLevelConfigSubclass extends LevelConfig {
  protected override _prepareContext(
    options: DeepPartial<LevelConfig.RenderOptions>,
  ): Promise<LevelConfig.RenderContext>;
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    updateData?: unknown,
  ): foundry.documents.BaseLevel.UpdateData;
}
