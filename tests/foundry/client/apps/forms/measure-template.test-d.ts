import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const measuredTemplateDocument: MeasuredTemplateDocument.Implementation;
const measuredTemplateConfig = new MeasuredTemplateConfig(measuredTemplateDocument);

expectTypeOf(measuredTemplateConfig.object).toEqualTypeOf<MeasuredTemplateDocument.Implementation>();
expectTypeOf(measuredTemplateConfig.document).toEqualTypeOf<MeasuredTemplateDocument.Implementation>();
expectTypeOf(MeasuredTemplateConfig.defaultOptions).toEqualTypeOf<
  DocumentSheet.Options<MeasuredTemplateDocument.Implementation>
>();
expectTypeOf(measuredTemplateConfig.options).toEqualTypeOf<
  DocumentSheet.Options<MeasuredTemplateDocument.Implementation>
>();
expectTypeOf(measuredTemplateConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<MeasuredTemplateConfig.MeasuredTemplateConfigData>>
>();
expectTypeOf(measuredTemplateConfig.render(true)).toEqualTypeOf<MeasuredTemplateConfig>();
