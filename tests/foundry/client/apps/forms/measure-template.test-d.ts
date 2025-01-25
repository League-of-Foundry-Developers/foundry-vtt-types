import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const measuredTemplateDocument: MeasuredTemplateDocument.ConfiguredInstance;
const measuredTemplateConfig = new MeasuredTemplateConfig(measuredTemplateDocument);

expectTypeOf(measuredTemplateConfig.object).toEqualTypeOf<MeasuredTemplateDocument>();
expectTypeOf(measuredTemplateConfig.document).toEqualTypeOf<MeasuredTemplateDocument>();
expectTypeOf(MeasuredTemplateConfig.defaultOptions).toEqualTypeOf<
  DocumentSheetOptions<MeasuredTemplateDocument.ConfiguredInstance>
>();
expectTypeOf(measuredTemplateConfig.options).toEqualTypeOf<
  DocumentSheetOptions<MeasuredTemplateDocument.ConfiguredInstance>
>();
expectTypeOf(measuredTemplateConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<MeasuredTemplateConfig.MeasuredTemplateConfigData>>
>();
expectTypeOf(measuredTemplateConfig.render(true)).toEqualTypeOf<MeasuredTemplateConfig>();
