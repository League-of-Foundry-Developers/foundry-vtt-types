import { expectTypeOf } from "vitest";
import type { DeepPartial } from "../../../../../src/utils/index.d.mts";

declare const doc: AmbientSoundDocument;
const soundSheet = new foundry.applications.sheets.AmbientSoundConfig({ document: doc });

expectTypeOf(soundSheet.title).toEqualTypeOf<string>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(soundSheet._onChangeForm(formConfig, event)).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.sheets.AmbientSoundConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.DocumentSheetV2.Configuration<AmbientSoundDocument>>
>();
expectTypeOf(foundry.applications.sheets.AmbientSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
