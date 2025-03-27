import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

// TODO: This file appears to be testing the old version of AmbientLightConfig
import AmbientSoundDocument = foundry.applications.sheets.AmbientSoundDocument;

declare const sound: AmbientSoundDocument;
const ambientSoundConfig = new AmbientSoundConfig(sound);

expectTypeOf(ambientSoundConfig.object).toEqualTypeOf<AmbientSoundDocument>();
expectTypeOf(ambientSoundConfig.document).toEqualTypeOf<AmbientSoundDocument>();
expectTypeOf(AmbientSoundConfig.defaultOptions).toEqualTypeOf<
  DocumentSheet.Options<AmbientSoundDocument.Implementation>
>();
expectTypeOf(ambientSoundConfig.options).toEqualTypeOf<DocumentSheet.Options<AmbientSoundDocument.Implementation>>();
expectTypeOf(ambientSoundConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(ambientSoundConfig.render(true)).toEqualTypeOf<AmbientSoundConfig>();

expectTypeOf(ambientSoundConfig.title).toEqualTypeOf<string>();
