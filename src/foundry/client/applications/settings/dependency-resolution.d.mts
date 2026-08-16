import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ModuleManagement from "../sidebar/apps/module-management.d.mts";

import Module = foundry.packages.Module;
import BooleanField = foundry.data.fields.BooleanField;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DependencyResolution: DependencyResolution.Any;
    }
  }
}

/**
 * A class responsible for prompting the user about dependency resolution for their modules.
 */
declare class DependencyResolution<
  RenderContext extends DependencyResolution.RenderContext = DependencyResolution.RenderContext,
  Configuration extends DependencyResolution.Configuration = DependencyResolution.Configuration,
  RenderOptions extends DependencyResolution.RenderOptions = DependencyResolution.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @param options - Options to configure DependencyResolution behavior.
   *
   * @privateRemarks `manager` and `root` are lifted out of the `DeepPartial` the base constructor
   * applies because both are required; the runtime reads them unconditionally.
   */
  constructor(options: DependencyResolution.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   tag: "dialog",
   *   classes: ["dependency-resolution", "dialog"],
   *   window: {
   *     contentTag: "form",
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-sitemap",
   *     title: "MODMANAGE.DependencyResolution"
   *   },
   *   position: {
   *     width: 480
   *   },
   *   actions: {
   *     cancel: DependencyResolution.#onCancel
   *   },
   *   form: {
   *     closeOnSubmit: true,
   *     handler: DependencyResolution.#onSubmitForm
   *   },
   *   enabling: true
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DependencyResolution.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   resolution: {
   *     classes: ["standard-form"],
   *     template: "templates/setup/impacted-dependencies.hbs"
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether there are additional dependencies that need resolving by the user.
   *
   * @remarks When disabling, also `true` if any Document subtypes would be rendered unavailable, even
   * though the root module is the only candidate.
   */
  get needsResolving(): boolean;

  /**
   * The module that is the root of the dependency resolution.
   */
  get root(): Module;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * @remarks Re-renders the resolution part so the dependency graph reflects the new checked state.
   */
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): MaybePromise<void>;

  /**
   * Return any modules that the root module is required by.
   * @internal
   *
   * @remarks Always empty when enabling; only a disable prompt asks what would break.
   */
  _getRootRequiredBy(): Set<Module>;

  #DependencyResolution: true;

  static #DependencyResolutionStatic: true;
}

declare namespace DependencyResolution {
  interface Any extends AnyDependencyResolution {}
  interface AnyConstructor extends Identity<typeof AnyDependencyResolution> {}

  /**
   * The options accepted by the {@linkcode DependencyResolution} constructor; `manager` and `root` are required.
   */
  type InputOptions<Configuration extends DependencyResolution.Configuration> = DeepPartial<
    Omit<Configuration, "manager" | "root">
  > & {
    manager: Configuration["manager"];
    root: Configuration["root"];
  };

  interface Descriptor {
    /** The module. */
    module: Module;

    /** Has the user toggled the checked state of this dependency in this application. */
    checked: boolean;

    /**
     * Some reason associated with the dependency.
     *
     * @remarks Accumulated as `${dependent.title}: ${reason}` lines, one per module that asked for
     * this dependency.
     */
    reason?: string | undefined;

    /** Whether this module is a hard requirement and cannot be unchecked. */
    required?: boolean | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    /** @remarks Always empty when disabling; nothing is a hard requirement of being turned off. */
    required: Descriptor[];

    optional: Descriptor[];

    /**
     * @remarks The formatted summary of Documents that would become unavailable, prepared only when
     * disabling.
     */
    subtypes: string | undefined;

    checkbox: BooleanField;

    enabling: boolean;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DependencyResolution> {
    /** The module management application. */
    manager: ModuleManagement.Any;

    /** The module that is the root of the dependency resolution. */
    root: Module;

    /**
     * Whether the root dependency is being enabled or disabled.
     *
     * @defaultValue `true`
     */
    enabling: boolean;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any> = DeepPartial<
    Configuration<DependencyResolution>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyDependencyResolution extends DependencyResolution<
  DependencyResolution.RenderContext,
  DependencyResolution.Configuration,
  DependencyResolution.RenderOptions
> {
  constructor(...args: never);
}

export default DependencyResolution;
