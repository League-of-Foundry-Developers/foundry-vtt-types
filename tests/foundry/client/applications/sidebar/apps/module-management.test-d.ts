import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import ClientIssues = foundry.helpers.ClientIssues;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import ModuleManagement = foundry.applications.sidebar.apps.ModuleManagement;

declare const moduleManagement: ModuleManagement;

expectTypeOf(moduleManagement).toExtend<ApplicationV2.Any>();

// Typed at its real width rather than the `"moduleConfiguration"` literal, so a subclass can key its own setting.
expectTypeOf(ModuleManagement.SETTING).toBeString();
expectTypeOf(ModuleManagement.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(moduleManagement.isEditable).toBeBoolean();

declare const counts: ClientIssues.ModuleSubTypeCounts;
declare const module: foundry.packages.Module;
expectTypeOf(moduleManagement._formatDocumentSummary(counts, false)).toBeString();
expectTypeOf(moduleManagement._formatDocumentSummary(counts, true, module)).toBeString();

expectTypeOf(moduleManagement._isModuleChecked("dice-so-nice")).toBeBoolean();
expectTypeOf(moduleManagement._onSelectDependencies({ "dice-so-nice": true }, true)).toBeVoid();

declare const renderOptions: DeepPartial<ModuleManagement.RenderOptions>;
declare const renderContext: DeepPartial<ModuleManagement.RenderContext>;
expectTypeOf(moduleManagement["_prepareContext"]({ ...renderOptions, isFirstRender: true })).toEqualTypeOf<
  Promise<ModuleManagement.RenderContext>
>();
expectTypeOf(moduleManagement["_onRender"](renderContext, renderOptions)).toEqualTypeOf<Promise<void>>();

declare const closingOptions: ApplicationV2.ClosingOptions;
expectTypeOf(moduleManagement["_tearDown"](closingOptions)).toBeVoid();

declare const element: HTMLElement;
expectTypeOf(moduleManagement["_attachPartListeners"]("body", element, renderOptions)).toBeVoid();

// Deprecated since v13, until v15.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ModuleManagement.CONFIG_SETTING).toBeString();

expectTypeOf<ModuleManagement.RenderContext["editable"]>().toBeBoolean();
expectTypeOf<ModuleManagement.RenderContext["expanded"]>().toBeBoolean();
expectTypeOf<ModuleManagement.RenderContext["modules"]>().toEqualTypeOf<ModuleManagement.ModuleContext[]>();
expectTypeOf<ModuleManagement.RenderContext["filters"]>().toEqualTypeOf<ModuleManagement.ModuleFilter[]>();
expectTypeOf<ModuleManagement.RenderContext["buttons"]>().toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

expectTypeOf<ModuleManagement.ModuleFilter["id"]>().toEqualTypeOf<ModuleManagement.FilterName>();
expectTypeOf<ModuleManagement.FilterName>().toEqualTypeOf<"all" | "active" | "inactive">();

// `authors` is replaced outright: the module's author set becomes a single pre-rendered string.
expectTypeOf<ModuleManagement.ModuleContext["authors"]>().toBeString();
expectTypeOf<ModuleManagement.ModuleContext["badge"]>().toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf<ModuleManagement.ModuleContext["enableable"]>().toBeBoolean();
expectTypeOf<ModuleManagement.ModuleContext["disabled"]>().toBeBoolean();
expectTypeOf<ModuleManagement.ModuleContext["documents"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<ModuleManagement.ModuleContext["labels"]>().toEqualTypeOf<ModuleManagement.ModuleLabels>();
