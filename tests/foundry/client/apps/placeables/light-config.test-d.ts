import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const lightDoc: AmbientLightDocument;
const ambientLightConfig = new AmbientLightConfig(lightDoc);

expectTypeOf(ambientLightConfig.object).toEqualTypeOf<AmbientLightDocument>();
expectTypeOf(AmbientLightConfig.defaultOptions).toEqualTypeOf<
  DocumentSheet.Options<AmbientLightDocument.ConfiguredInstance>
>();
expectTypeOf(ambientLightConfig.options).toEqualTypeOf<
  DocumentSheet.Options<AmbientLightDocument.ConfiguredInstance>
>();
expectTypeOf(ambientLightConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(ambientLightConfig.render(true)).toEqualTypeOf<AmbientLightConfig>();

expectTypeOf(ambientLightConfig.preview).toEqualTypeOf<AmbientLightDocument>();
