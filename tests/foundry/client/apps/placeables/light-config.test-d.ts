import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

// TODO: This file appears to be testing the old version of AmbientLightConfig
import AmbientLightConfig = foundry.applications.sheets.AmbientLightConfig;

declare const lightDoc: AmbientLightDocument;
const ambientLightConfig = new AmbientLightConfig(lightDoc);

expectTypeOf(ambientLightConfig.object).toEqualTypeOf<AmbientLightDocument>();
expectTypeOf(AmbientLightConfig.defaultOptions).toEqualTypeOf<
  DocumentSheet.Options<AmbientLightDocument.Implementation>
>();
expectTypeOf(ambientLightConfig.options).toEqualTypeOf<DocumentSheet.Options<AmbientLightDocument.Implementation>>();
expectTypeOf(ambientLightConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(ambientLightConfig.render(true)).toEqualTypeOf<AmbientLightConfig>();

expectTypeOf(ambientLightConfig.preview).toEqualTypeOf<AmbientLightDocument>();
