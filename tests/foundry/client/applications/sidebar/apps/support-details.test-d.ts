import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import SupportDetails = foundry.applications.sidebar.apps.SupportDetails;

declare const supportDetails: SupportDetails;

expectTypeOf(supportDetails).toExtend<ApplicationV2.Any>();

expectTypeOf(SupportDetails.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(SupportDetails.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const partOptions: DeepPartial<HandlebarsApplicationMixin.RenderOptions>;
declare const partContext: ApplicationV2.RenderContextOf<SupportDetails>;
expectTypeOf(supportDetails["_preparePartContext"]("support", partContext, partOptions)).toEqualTypeOf<
  Promise<ApplicationV2.RenderContextOf<SupportDetails>>
>();

expectTypeOf(supportDetails["_getDocumentValidationErrors"]()).toEqualTypeOf<
  SupportDetails.DocumentValidationErrors[]
>();
expectTypeOf(supportDetails["_getModuleIssues"]()).toEqualTypeOf<SupportDetails.ModuleIssueGroup[]>();

expectTypeOf(SupportDetails.generateSupportReport()).toEqualTypeOf<Promise<SupportDetails.SupportReportData>>();

declare const gl: WebGL2RenderingContext;
expectTypeOf(SupportDetails.getWebGLRendererInfo(gl)).toBeString();

expectTypeOf<SupportDetails.DocumentValidationErrors["documents"]>().toEqualTypeOf<SupportDetails.InvalidDocument[]>();
expectTypeOf<SupportDetails.InvalidDocument["validationError"]>().toBeString();
expectTypeOf<SupportDetails.ModuleIssueGroup["issues"]>().toEqualTypeOf<SupportDetails.ModuleIssues[]>();
expectTypeOf<SupportDetails.ModuleIssue["severity"]>().toEqualTypeOf<"error" | "warning">();

// `"Could not detect"` when no WebGL context could be established.
expectTypeOf<SupportDetails.SupportReportData["maxTextureSize"]>().toEqualTypeOf<number | string>();

// The collection counts are strings, not numbers: an invalid-document count is appended in parentheses.
expectTypeOf<SupportDetails.SupportReportData["actors"]>().toBeString();
expectTypeOf<SupportDetails.SupportReportData["journal"]>().toBeString();
expectTypeOf<SupportDetails.SupportReportData["messages"]>().toBeString();

// Foundry's typedef says `string[]`; the runtime joins the list before assigning it.
expectTypeOf<SupportDetails.SupportReportData["worldScripts"]>().toBeString();

expectTypeOf<SupportDetails.SupportReportData["activeModuleCount"]>().toBeNumber();
expectTypeOf<SupportDetails.SupportReportData["packs"]>().toBeNumber();
expectTypeOf<SupportDetails.SupportReportData["hasViewedScene"]>().toBeBoolean();

// Scene metrics are only collected when a scene is in view.
expectTypeOf<SupportDetails.SupportReportData["sceneDimensions"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<SupportDetails.SupportReportData["walls"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<SupportDetails.SupportReportData["tokens"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<SupportDetails.SupportReportData["largestTexture"]>().toEqualTypeOf<
  SupportDetails.LargestTexture | undefined
>();
expectTypeOf<SupportDetails.LargestTexture["src"]>().toEqualTypeOf<string | undefined>();
