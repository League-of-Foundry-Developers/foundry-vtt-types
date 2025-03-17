import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const supportDetails = new SupportDetails();

expectTypeOf(SupportDetails.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(supportDetails.options).toEqualTypeOf<Application.Options>();
expectTypeOf(supportDetails.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(supportDetails.render(true)).toEqualTypeOf<SupportDetails>();

expectTypeOf(SupportDetails.generateSupportReport()).toEqualTypeOf<SupportDetails.ReportData>();

declare const gl: WebGLRenderingContext;
expectTypeOf(SupportDetails.getWebGLRendererInfo(gl)).toEqualTypeOf<string>();
