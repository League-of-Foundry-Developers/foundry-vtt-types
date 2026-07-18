import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AppV2QuickStartTemplate from "#client/applications/quickstart.mjs";
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

expectTypeOf(AppV2QuickStartTemplate.DEFAULT_OPTIONS).toEqualTypeOf<AppV2QuickStartTemplate.DefaultOptions>();
expectTypeOf(AppV2QuickStartTemplate.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestAppV2QuickStartTemplateSubclass extends AppV2QuickStartTemplate {
  protected override _prepareContext(
    options: DeepPartial<AppV2QuickStartTemplate.RenderOptions> & { isFirstRender: boolean },
  ): Promise<AppV2QuickStartTemplate.RenderContext>;
}

declare const template: AppV2QuickStartTemplate;
expectTypeOf(template).toEqualTypeOf<AppV2QuickStartTemplate>();
