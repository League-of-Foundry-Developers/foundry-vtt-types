import { expectTypeOf } from "vitest";

// This entire file tests a single deprecated class, so every reference below is expected.
/* eslint-disable @typescript-eslint/no-deprecated */
import MeasuredTemplateConfig = foundry.applications.sheets.MeasuredTemplateConfig;

declare const doc: MeasuredTemplateDocument.Implementation;
const sheet = new MeasuredTemplateConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<MeasuredTemplateDocument.Implementation>();

expectTypeOf(
  MeasuredTemplateConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(MeasuredTemplateConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
