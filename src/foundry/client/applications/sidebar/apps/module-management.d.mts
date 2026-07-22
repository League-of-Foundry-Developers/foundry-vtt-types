import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { RelatedPackage } from "#common/packages/_module.d.mts";
import type { ClientPackageMixin } from "#client/packages/_module.d.mts";

import ClientIssues = foundry.helpers.ClientIssues;
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
   */
  static readonly SETTING: "moduleConfiguration";

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
   *   position: { width: 680 },
   *   form: {
   *     handler: ModuleManagement.#onSubmitForm,
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     changeFilter: ModuleManagement.#onChangeFilter,
   *     deactivateAll: ModuleManagement.#onDeactivateAll,
   *     toggleExpanded: ModuleManagement.#onToggleExpanded
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ModuleManagement.DefaultOptions;

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
   * @internal
   */
  _formatDocumentSummary(
    counts: ClientIssues.ModuleSubTypeCounts,
    verbose: boolean,
    module?: Module | ModuleManagement.ModuleData,
  ): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _tearDown(options: DeepPartial<ApplicationV2.ClosingOptions>): void;

  /**
   * Check if a module is enabled currently in the application.
   * @param id - The module ID.
   * @internal
   */
  _isModuleChecked(id: string): boolean;

  /**
   * Update the checked state of modules based on user dependency resolution.
   * @param formData - The dependency resolution result.
   * @param enabling  - Whether the user was performing an enabling or disabling workflow.
   * @internal
   */
  _onSelectDependencies(formData: Record<string, boolean>, enabling: boolean): void;

  protected override _attachPartListeners(
    partId: string,
    htmlElement: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;

  /**
   * @deprecated since v13, until v15
   * @remarks `"ModuleManagement.CONFIG_SETTING is deprecated in favor of ModuleManagement.SETTING"`
   */
  static get CONFIG_SETTING(): string;

  #ModuleManagement: true;
}

declare namespace ModuleManagement {
  interface Any extends AnyModuleManagement {}
  interface AnyConstructor extends Identity<typeof AnyModuleManagement> {}

  /**
   * @remarks A relationship entry ({@linkcode RelatedPackage.Data}) mutated in place by
   * `#evaluateDependencies`/`#evaluateSystemCompatibility` to carry a warning/error class and tooltip.
   */
  interface ModuleRelationshipEntry extends RelatedPackage.Data {
    class?: "error" | "warning" | undefined;
    tooltip?: string | undefined;
  }

  interface ModuleRelationships {
    systems: ModuleRelationshipEntry[];
    requires: ModuleRelationshipEntry[];
    recommends: RelatedPackage.Data[];
    conflicts: RelatedPackage.Data[];
    flags: Record<string, unknown>;
  }

  /**
   * @remarks The shape of `module.toObject()`, with additional properties computed for display by `_prepareContext`.
   */
  interface ModuleData extends Omit<Module["_source"], "authors" | "relationships"> {
    active: boolean;
    hidden: boolean;
    hasPacks: boolean;
    hasScripts: boolean;
    hasStyles: boolean;
    relationships: ModuleRelationships;
    systemOnly: ModuleRelationshipEntry | undefined;
    systemTag: string;

    /** @remarks Overwritten from the source `Set<AuthorData>`/array to a comma-joined string (of names, or `<a>` tags for authors with a `url`). */
    authors: string;

    /** @remarks Empty string by default; set to a localized message if `required` or if there's a dependency/system compatibility issue. */
    tooltip: string;

    /** Whether this module is required by the World or the active System. */
    required: boolean;

    labels: {
      authors: string;
    };

    badge: ClientPackageMixin.CompatibilityBadge | null;

    /** Only set if this module provides any Document sub-types. */
    documents?: string | undefined;

    /** Only set if this module provides any Document sub-types. */
    documentsVerbose?: string | undefined;

    enableable: boolean;
    disabled: boolean;
  }

  interface FilterData {
    id: "all" | "active" | "inactive";
    label: string;
    count: number;
    active: boolean;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    editable: boolean;
    expanded: boolean;
    modules: ModuleData[];
    filters: FilterData[];
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
