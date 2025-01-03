import { expectTypeOf } from "vitest";

declare const doc: AmbientSoundDocument;

expectTypeOf(AmbientSoundConfig.defaultOptions).toEqualTypeOf<
  DocumentSheetOptions<AmbientSoundDocument.ConfiguredInstance>
>();

const config = new AmbientSoundConfig(doc);
expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf(config.close()).toEqualTypeOf<Promise<void>>();
