import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

// TODO: This file appears to be testing the old version of AmbientLightConfig
import AmbientSoundDocument = foundry.applications.sheets.AmbientSoundDocument;

declare const sound: AmbientSoundDocument.Implementation;
const ambientSoundConfig = new AmbientSoundConfig(sound);

expectTypeOf(ambientSoundConfig.object).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(ambientSoundConfig.document).toEqualTypeOf<AmbientSoundDocument.Implementation>();
expectTypeOf(AmbientSoundConfig.defaultOptions).toEqualTypeOf<
  DocumentSheet.Options<AmbientSoundDocument.Implementation>
>();
expectTypeOf(ambientSoundConfig.options).toEqualTypeOf<DocumentSheet.Options<AmbientSoundDocument.Implementation>>();
expectTypeOf(ambientSoundConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(ambientSoundConfig.render(true)).toEqualTypeOf<AmbientSoundConfig>();

expectTypeOf(ambientSoundConfig.title).toEqualTypeOf<string>();
