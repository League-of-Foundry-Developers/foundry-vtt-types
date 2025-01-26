import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const supportDetails = new SupportDetails();

expectTypeOf(SupportDetails.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(supportDetails.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(supportDetails.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(supportDetails.render(true)).toEqualTypeOf<SupportDetails>();

expectTypeOf(SupportDetails.generateSupportReport()).toEqualTypeOf<SupportReportData>();

declare const gl: WebGLRenderingContext;
expectTypeOf(SupportDetails.getWebGLRendererInfo(gl)).toEqualTypeOf<string>();
