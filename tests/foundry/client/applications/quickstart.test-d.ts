import { expectTypeOf } from "vitest";
// Not re-exported from `applications/_module.mjs`, matching Foundry — the scaffold is not part of
// the public namespace.
import type AppV2QuickStartTemplate from "#client/applications/quickstart.d.mts";

import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const quickStart: AppV2QuickStartTemplate;
declare const QuickStartClass: typeof AppV2QuickStartTemplate;

expectTypeOf(QuickStartClass.DEFAULT_OPTIONS).toEqualTypeOf<AppV2QuickStartTemplate.DefaultOptions>();
expectTypeOf(QuickStartClass.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(quickStart["_prepareContext"]({ isFirstRender: true })).toEqualTypeOf<
  Promise<AppV2QuickStartTemplate.RenderContext>
>();
