import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const app = new foundry.applications.sidebar.apps.ModuleManagement();

expectTypeOf(foundry.applications.sidebar.apps.ModuleManagement.SETTING).toEqualTypeOf<"moduleConfiguration">();
expectTypeOf(
  foundry.applications.sidebar.apps.ModuleManagement.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sidebar.apps.ModuleManagement.DefaultOptions>();
expectTypeOf(foundry.applications.sidebar.apps.ModuleManagement.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(foundry.applications.sidebar.apps.ModuleManagement.CONFIG_SETTING).toEqualTypeOf<string>();

expectTypeOf(app.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(app._isModuleChecked("some-module")).toEqualTypeOf<boolean>();
expectTypeOf(app._onSelectDependencies({ "some-module": true }, true)).toEqualTypeOf<void>();

declare const counts: foundry.helpers.ClientIssues.ModuleSubTypeCounts;
declare const module_: foundry.packages.Module;
expectTypeOf(app._formatDocumentSummary(counts, true, module_)).toEqualTypeOf<string>();
expectTypeOf(app._formatDocumentSummary(counts, false)).toEqualTypeOf<string>();

declare class _TestModuleManagementSubclass extends foundry.applications.sidebar.apps.ModuleManagement {
  protected override _prepareContext(
    options: DeepPartial<foundry.applications.sidebar.apps.ModuleManagement.RenderOptions>,
  ): Promise<foundry.applications.sidebar.apps.ModuleManagement.RenderContext>;

  protected override _tearDown(options: DeepPartial<foundry.applications.api.ApplicationV2.ClosingOptions>): void;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.ModuleManagement>();
