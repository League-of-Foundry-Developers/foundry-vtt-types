import { expectType } from "tsd";

declare const doc: AmbientSoundDocument;

expectType<DocumentSheetOptions>(AmbientSoundConfig.defaultOptions);

const config = new AmbientSoundConfig(doc);
expectType<string>(config.title);
expectType<Promise<void>>(config.close());
