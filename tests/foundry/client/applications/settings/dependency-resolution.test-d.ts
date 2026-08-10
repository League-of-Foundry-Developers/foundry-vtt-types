import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import DependencyResolution = foundry.applications.settings.DependencyResolution;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const manager: foundry.applications.sidebar.apps.ModuleManagement;
declare const root: foundry.packages.Module;

const app = new DependencyResolution({ manager, root });

expectTypeOf(DependencyResolution.DEFAULT_OPTIONS).toEqualTypeOf<DependencyResolution.DefaultOptions>();

expectTypeOf(app.needsResolving).toBeBoolean();
expectTypeOf(app.root).toEqualTypeOf<foundry.packages.Module>();
expectTypeOf(app._getRootRequiredBy()).toEqualTypeOf<Set<foundry.packages.Module>>();

expectTypeOf(app.options.manager).toEqualTypeOf<foundry.applications.sidebar.apps.ModuleManagement.Any>();
expectTypeOf(app.options.root).toEqualTypeOf<foundry.packages.Module>();
expectTypeOf(app.options.enabling).toBeBoolean();

declare const descriptor: DependencyResolution.Descriptor;
expectTypeOf(descriptor.module).toEqualTypeOf<foundry.packages.Module>();
expectTypeOf(descriptor.checked).toBeBoolean();
expectTypeOf(descriptor.reason).toEqualTypeOf<string | undefined>();
expectTypeOf(descriptor.required).toEqualTypeOf<boolean | undefined>();

declare const context: DependencyResolution.RenderContext;
expectTypeOf(context.required).toEqualTypeOf<DependencyResolution.Descriptor[]>();
expectTypeOf(context.optional).toEqualTypeOf<DependencyResolution.Descriptor[]>();
expectTypeOf(context.subtypes).toEqualTypeOf<string | undefined>();
expectTypeOf(context.checkbox).toEqualTypeOf<foundry.data.fields.BooleanField>();
expectTypeOf(context.enabling).toBeBoolean();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

class CustomDependencyResolution extends DependencyResolution {
  protected override async _prepareContext(
    options: DeepPartial<DependencyResolution.RenderOptions> & { isFirstRender: boolean },
  ): Promise<DependencyResolution.RenderContext> {
    return super._prepareContext(options);
  }

  testProtected(formConfig: ApplicationV2.FormConfiguration, event: Event): void {
    expectTypeOf(this._onChangeForm(formConfig, event)).toEqualTypeOf<MaybePromise<void>>();
  }
}

expectTypeOf(
  new CustomDependencyResolution({ manager, root, enabling: false }),
).toEqualTypeOf<CustomDependencyResolution>();
