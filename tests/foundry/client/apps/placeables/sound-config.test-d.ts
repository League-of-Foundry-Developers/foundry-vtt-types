import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const sound: AmbientSoundDocument;
const ambientSoundConfig = new AmbientSoundConfig(sound);

expectTypeOf(ambientSoundConfig.object).toEqualTypeOf<AmbientSoundDocument>();
expectTypeOf(ambientSoundConfig.document).toEqualTypeOf<AmbientSoundDocument>();
expectTypeOf(AmbientSoundConfig.defaultOptions).toEqualTypeOf<
  DocumentSheetOptions<AmbientSoundDocument.Implementation>
>();
expectTypeOf(ambientSoundConfig.options).toEqualTypeOf<DocumentSheetOptions<AmbientSoundDocument.ConfiguredInstance>>();
expectTypeOf(ambientSoundConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(ambientSoundConfig.render(true)).toEqualTypeOf<AmbientSoundConfig>();

expectTypeOf(ambientSoundConfig.title).toEqualTypeOf<string>();
