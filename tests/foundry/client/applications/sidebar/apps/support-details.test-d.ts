import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const app = new foundry.applications.sidebar.apps.SupportDetails();

expectTypeOf(
  foundry.applications.sidebar.apps.SupportDetails.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sidebar.apps.SupportDetails.DefaultOptions>();
expectTypeOf(foundry.applications.sidebar.apps.SupportDetails.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sidebar.apps.SupportDetails.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

expectTypeOf(foundry.applications.sidebar.apps.SupportDetails.generateSupportReport()).toEqualTypeOf<
  Promise<foundry.applications.sidebar.apps.SupportDetails.SupportReportData>
>();

declare const gl: WebGLRenderingContext;
expectTypeOf(foundry.applications.sidebar.apps.SupportDetails.getWebGLRendererInfo(gl)).toEqualTypeOf<string>();

declare class _TestSupportDetailsSubclass extends foundry.applications.sidebar.apps.SupportDetails {
  protected override _preparePartContext(
    partId: string,
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<foundry.applications.sidebar.apps.SupportDetails.RenderOptions>,
  ): Promise<foundry.applications.api.ApplicationV2.RenderContextOf<this>>;

  protected override _getDocumentValidationErrors(): foundry.applications.sidebar.apps.SupportDetails.DocumentValidationErrorGroup[];

  protected override _getModuleIssues(): foundry.applications.sidebar.apps.SupportDetails.ModuleIssueGroup[];
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.SupportDetails>();
