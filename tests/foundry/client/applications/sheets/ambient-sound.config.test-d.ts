import { expectTypeOf } from "vitest";
import type { RemoveIndexSignatures } from "fvtt-types/utils";

import AmbientSoundConfig = foundry.applications.sheets.AmbientSoundConfig;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const doc: AmbientSoundDocument.Implementation;
const soundSheet = new AmbientSoundConfig({ document: doc });

expectTypeOf(soundSheet.document).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(soundSheet.options).toEqualTypeOf<Readonly<AmbientSoundConfig.Configuration>>();
expectTypeOf(soundSheet.title).toEqualTypeOf<string>();

expectTypeOf(AmbientSoundConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();

expectTypeOf(AmbientSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const context: AmbientSoundConfig.RenderContext;
expectTypeOf(context.soundEffects).toEqualTypeOf<RemoveIndexSignatures<CONFIG.SoundEffects>>();
expectTypeOf(context.buttons).toEqualTypeOf<foundry.applications.api.ApplicationV2.FormFooterButton[]>();

class CustomAmbientSoundConfig extends AmbientSoundConfig {
  protected override _toggleDisabledFields(): void {
    super._toggleDisabledFields();
  }

  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void {
    super._onChangeForm(formConfig, event);
  }
}

expectTypeOf(CustomAmbientSoundConfig).toExtend<AmbientSoundConfig.AnyConstructor>();
