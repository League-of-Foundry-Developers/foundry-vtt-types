import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const doc: AmbientSoundDocument.Implementation;
const soundConfig = new foundry.applications.sheets.AmbientSoundConfig({ document: doc });

expectTypeOf(soundConfig.document).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(soundConfig.options).toEqualTypeOf<
  Readonly<foundry.applications.sheets.AmbientSoundConfig.Configuration>
>();
expectTypeOf(soundConfig.title).toEqualTypeOf<string>();

expectTypeOf(foundry.applications.sheets.AmbientSoundConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<AmbientSoundDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.AmbientSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestAmbientSoundConfigSubclass extends foundry.applications.sheets.AmbientSoundConfig {
  protected override _onRender(
    context: DeepPartial<foundry.applications.sheets.AmbientSoundConfig.RenderContext>,
    options: DeepPartial<foundry.applications.sheets.AmbientSoundConfig.RenderOptions>,
  ): Promise<void>;
  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void;
}
