import { expectTypeOf } from "vitest";

import AmbientSoundConfig = foundry.applications.sheets.AmbientSoundConfig;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const doc: AmbientSoundDocument.Implementation;
const soundSheet = new AmbientSoundConfig({ document: doc });

expectTypeOf(soundSheet.document).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(soundSheet.options).toEqualTypeOf<Readonly<AmbientSoundConfig.Configuration>>();
expectTypeOf(soundSheet.title).toEqualTypeOf<string>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(soundSheet._onChangeForm(formConfig, event)).toEqualTypeOf<void>();

expectTypeOf(AmbientSoundConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();

expectTypeOf(AmbientSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
