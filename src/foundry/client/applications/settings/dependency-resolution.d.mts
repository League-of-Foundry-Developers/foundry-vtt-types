import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { ModuleManagement } from "../sidebar/apps/_module.d.mts";
import type { fields } from "#common/data/_module.d.mts";

import Module = foundry.packages.Module;

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
   * @remarks `manager` and `root` are deliberately excluded from the `DeepPartial` applied to the rest of the
   * options, mirroring {@linkcode foundry.applications.api.DocumentSheetV2.InputOptions | DocumentSheetV2.InputOptions}.
   * Application and Module instances are not designed to be deep-partialed, so allowing that recursion to reach
   * into them produces incorrect and extremely expensive-to-check types.
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

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether there are additional dependencies that need resolving by the user.
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

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Return any modules that the root module is required by.
   * @internal
   */
  _getRootRequiredBy(): Set<Module>;

  #DependencyResolution: true;
}

declare namespace DependencyResolution {
  interface Any extends AnyDependencyResolution {}
  interface AnyConstructor extends Identity<typeof AnyDependencyResolution> {}

  /**
   * @remarks Has the user toggled the checked state of this dependency in this application.
   */
  interface DependencyDescriptor {
    module: Module;
    checked: boolean;
    /** Some reason associated with the dependency. */
    reason?: string | undefined;
    /** Whether this module is a hard requirement and cannot be unchecked. */
    required?: boolean | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    required: DependencyDescriptor[];
    optional: DependencyDescriptor[];
    /** Only present if disabling the root module would render document subtypes unavailable. */
    subtypes: string | undefined;
    checkbox: fields.BooleanField;
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
     * @defaultValue `true`
     */
    enabling?: boolean;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any> = DeepPartial<
    Configuration<DependencyResolution>
  > &
    object;

  type InputOptions<Configuration extends DependencyResolution.Configuration = DependencyResolution.Configuration> =
    DeepPartial<Omit<Configuration, "manager" | "root">> & {
      manager: Configuration["manager"];
      root: Configuration["root"];
    };

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
