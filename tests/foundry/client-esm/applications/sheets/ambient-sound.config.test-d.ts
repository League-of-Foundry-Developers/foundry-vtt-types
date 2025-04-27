import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AmbientSoundConfig = foundry.applications.sheets.AmbientSoundConfig;

declare const doc: AmbientSoundDocument.Implementation;
const soundSheet = new AmbientSoundConfig({ document: doc });

expectTypeOf(soundSheet.document).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(soundSheet.options).toEqualTypeOf<DocumentSheet.Options<AmbientSoundDocument.Implementation>>();
expectTypeOf(soundSheet.title).toEqualTypeOf<string>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(soundSheet._onChangeForm(formConfig, event)).toEqualTypeOf<void>();

expectTypeOf(AmbientSoundConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.DocumentSheetV2.Configuration<AmbientSoundDocument.Implementation>>
>();
expectTypeOf(AmbientSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
