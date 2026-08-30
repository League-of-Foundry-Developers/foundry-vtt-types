import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import ClientIssues = foundry.helpers.ClientIssues;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;
import Module = foundry.packages.Module;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ModuleManagement: ModuleManagement.Any;
    }
  }
}

/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 */
declare class ModuleManagement<
  RenderContext extends ModuleManagement.RenderContext = ModuleManagement.RenderContext,
  Configuration extends ModuleManagement.Configuration = ModuleManagement.Configuration,
  RenderOptions extends ModuleManagement.RenderOptions = ModuleManagement.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * The named game setting which persists module configuration.
   * @remarks This is typed as a literal because it is a core setting key, and so needs to be passable to {@linkcode game.settings.get}.
   *
   * Foundry marks `@readonly` but does nothing to that effect at runtime.
   */
  static SETTING: "moduleConfiguration";

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "module-management",
   *   tag: "form",
   *   window: {
   *     title: "MODMANAGE.Title",
   *     icon: "fa-solid fa-cube",
   *     contentClasses: ["standard-form"]
   *   },
   *   position: {width: 680},
   *   form: {
   *     handler: this.#onSubmitForm,
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     changeFilter: this.#onChangeFilter,
   *     deactivateAll: this.#onDeactivateAll,
   *     toggleExpanded: this.#onToggleExpanded
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ModuleManagement.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {
   *     template: "templates/sidebar/apps/module-management.hbs",
   *     templates: ["templates/setup/parts/package-tags.hbs"],
   *     root: true
   *   },
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Can the current User manage modules?
   */
  get isEditable(): boolean;

  /**
   * Format a document count collection for display.
   * @param counts  - An object of sub-type counts.
   * @param verbose - Detailed breakdown of by sub-type?
   * @param module  - Are sub-types relative to a module?
   * @returns The formatted document count
   *
   * @remarks Empty when no sub-type has a non-zero count. The verbose form is a `<ul>` of markup rather than
   * plain text.
   *
   * @internal
   */
  _formatDocumentSummary(counts: ClientIssues.ModuleSubTypeCounts, verbose: boolean, module?: Module): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _tearDown(options: ApplicationV2.ClosingOptions): void;

  /**
   * Check if a module is enabled currently in the application.
   * @param id - The module ID.
   *
   * @internal
   */
  _isModuleChecked(id: string): boolean;

  /**
   * Update the checked state of modules based on user dependency resolution.
   * @param formData - The dependency resolution result.
   * @param enabling - Whether the user was performing an enabling or disabling workflow.
   *
   * @internal
   */
  _onSelectDependencies(formData: Record<string, boolean>, enabling: boolean): void;

  protected override _attachPartListeners(
    partId: string,
    element: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;

  /**
   * @deprecated since v13 until v15.
   * @remarks "ModuleManagement.CONFIG_SETTING is deprecated in favor of ModuleManagement.SETTING"
   */
  static get CONFIG_SETTING(): string;

  #ModuleManagement: true;

  static #ModuleManagementStatic: true;
}

declare namespace ModuleManagement {
  interface Any extends AnyModuleManagement {}
  interface AnyConstructor extends Identity<typeof AnyModuleManagement> {}

  /** Which subset of the module list is shown. */
  type FilterName = "all" | "active" | "inactive";

  /**
   * A module's source data, annotated for display in the module list.
   *
   * @remarks Built from {@linkcode Module.toObject | Module#toObject}, so the inherited members are source data:
   * `relationships` and `packs` arrive as arrays rather than as the Sets an initialized {@linkcode Module} exposes.
   *
   * @privateRemarks `Omit` rather than a `_`-prefixed base per CS-8 because {@linkcode Module.Source} is generated
   * from the package schema and cannot be split; `authors` is the one member the annotation replaces outright.
   */
  interface ModuleContext extends Omit<Module.Source, "authors"> {
    active: boolean;

    /** Whether the current filter hides this module. */
    hidden: boolean;

    hasPacks: boolean;

    hasScripts: boolean;

    hasStyles: boolean;

    /** The relationship entry naming the active system, when the module declares one. */
    systemOnly?: Module.SystemSource | undefined;

    systemTag: string;

    /** The authors, comma-separated, each wrapped in an anchor when it declares a URL. */
    authors: string;

    /** Empty unless the module is required by the world or system, or has an unmet dependency. */
    tooltip: string;

    /** Whether the world or the system lists this module as required. */
    required: boolean;

    labels: ModuleLabels;

    badge: ClientPackageMixin.CompatibilityBadge | null;

    /**
     * A summary of the documents this module contributes.
     *
     * @remarks Absent, along with `documentsVerbose`, when the module registers no document sub-types.
     */
    documents?: string | undefined;

    /** The same summary broken down by sub-type, as markup. */
    documentsVerbose?: string | undefined;

    /** Whether activation is permitted: `false` when a dependency or system requirement is unmet. */
    enableable: boolean;

    disabled: boolean;
  }

  interface ModuleLabels {
    /** The localized singular or plural "Author" heading. */
    authors: string;
  }

  interface ModuleFilter {
    id: FilterName;

    label: string;

    count: number;

    active: boolean;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    editable: boolean;

    /** Whether module descriptions are shown expanded. */
    expanded: boolean;

    /**
     * The modules available to this world, sorted by title.
     *
     * @remarks Inactive modules are omitted for a user who cannot manage modules, as is any module that declares
     * supported systems but not the active one.
     */
    modules: ModuleContext[];

    /** @remarks Empty for a user who cannot manage modules. */
    filters: ModuleFilter[];

    /** @remarks Empty for a user who cannot manage modules. */
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<ModuleManagement extends ModuleManagement.Any = ModuleManagement.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<ModuleManagement> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ModuleManagement extends ModuleManagement.Any = ModuleManagement.Any> = DeepPartial<
    Configuration<ModuleManagement>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyModuleManagement extends ModuleManagement<
  ModuleManagement.RenderContext,
  ModuleManagement.Configuration,
  ModuleManagement.RenderOptions
> {
  constructor(...args: never);
}

export default ModuleManagement;
