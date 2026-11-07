import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";
import type ClientPackageMixin from "#client/packages/client-package.d.mts";
import type Setup from "../setup.d.mts";

import World = foundry.packages.World;
import System = foundry.packages.System;
import Module = foundry.packages.Module;

/**
 * The primary application which renders packages on the Setup view.
 */
declare class SetupPackages<
  RenderContext extends SetupPackages.RenderContext = SetupPackages.RenderContext,
  Configuration extends SetupPackages.Configuration = SetupPackages.Configuration,
  RenderOptions extends SetupPackages.RenderOptions = SetupPackages.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "setup-packages",
   *   classes: ["application", "framed"],
   *   tag: "section",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: SetupPackages.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     id: "header",
   *     template: "templates/setup/setup-packages-header.hbs"
   *   },
   *   worlds: {
   *     id: "worlds",
   *     template: "templates/setup/setup-packages-worlds.hbs",
   *     templates: SetupPackages.#PARTIALS,
   *     scrollable: ["#worlds-list"]
   *   },
   *   systems: {
   *     id: "systems",
   *     template: "templates/setup/setup-packages-systems.hbs",
   *     templates: SetupPackages.#PARTIALS,
   *     scrollable: ["#systems-list"]
   *   },
   *   modules: {
   *     id: "modules",
   *     template: "templates/setup/setup-packages-modules.hbs",
   *     templates: SetupPackages.#PARTIALS,
   *     scrollable: ["#modules-list"]
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   primary: {
   *     tabs: [
   *       {id: "worlds", label: "SETUP.Worlds"},
   *       {id: "systems", label: "SETUP.Systems"},
   *       {id: "modules", label: "SETUP.Modules"}
   *     ],
   *     initial: "worlds"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * A mapping of package IDs to progress bar elements
   */
  progressBars: Map<string, HTMLElement>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * @remarks Does not call `super`.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  /**
   * Set the search filter.
   * @param query - The query
   */
  search(query: string): void;

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  /**
   * Toggle the locked state of the interface.
   * @param locked - Is the interface locked?
   */
  toggleLock(locked: boolean, options?: SetupPackages.ToggleLockOptions): void;

  /**
   * Format the authors of a package into a string of comma-separated links for display.
   */
  static formatAuthors(authors?: SetupPackages.Author[]): string;

  /**
   * Obtain a cover image used to represent the package.
   * Prefer the "setup" media type, and prefer a thumbnail to the full image.
   * Otherwise, use a background image if the package has one.
   * @param pkg - The package which requires a cover image.
   * @returns A cover image URL if one exists.
   */
  static getCover(pkg: Setup.Package | null | undefined): string | void;

  /**
   * Prepare data for rendering a view of modules.
   */
  static prepareModules(): SetupPackages.PreparedModule[];

  /**
   * Prepare data for rendering a view of systems.
   */
  static prepareSystems(): SetupPackages.PreparedSystem[];

  /**
   * Sort packages by favorite, then alphabetically.
   */
  static sortPackages(a: SetupPackages.SortablePackage, b: SetupPackages.SortablePackage): number;

  /**
   * Update the UI progress bar in response to server progress ticks.
   * @param progress - The incremental progress information.
   */
  onProgress(progress?: Setup.ProgressReceiverPacket): void;

  /**
   * Remove a Progress Bar from the DOM and from the progress mapping.
   * @param id - The operation ID that is no longer being tracked.
   */
  removeProgressBar(id: string): void;

  #SetupPackages: true;
  static #SetupPackagesStatic: true;
}

declare namespace SetupPackages {
  interface Any extends AnySetupPackages {}
  interface AnyConstructor extends Identity<typeof AnySetupPackages> {}

  type ViewModeId = "GALLERY" | "TILES" | "DETAILS";

  /** @remarks The allowed view modes which can be used for each package-type tab. */
  interface ViewMode {
    id: ViewModeId;

    icon: string;

    /** @remarks A localization key. */
    label: string;

    template: string;
  }

  interface Author {
    name: string;

    url?: string | null | undefined;
  }

  interface SortablePackage {
    favorite: boolean;

    title: string;
  }

  /** @internal */
  interface _PreparedPackage {
    /** @remarks The authors, formatted by {@linkcode SetupPackages.formatAuthors}. */
    authors: string;

    /** @remarks A plain-text preview of the description. */
    shortDesc: string;

    badge: ClientPackageMixin.CompatibilityBadge | null;

    favorite: boolean;

    locked: boolean;

    /** @remarks The cover image, falling back to `"ui/anvil-bg.png"`. */
    thumb: string;
  }

  interface PreparedWorld extends Omit<World.Source, "authors" | "system">, _PreparedPackage {
    /** @remarks The World's System, if it is installed. */
    system: System | undefined;

    systemBadge: ClientPackageMixin.CompatibilityBadge | null;

    available: boolean;

    lastPlayedDate: Date;

    /** @remarks Blank if the World was never played. */
    lastPlayedLabel: string;

    canPlay: boolean;
  }

  interface PreparedSystem extends Omit<System.Source, "authors">, _PreparedPackage {
    /** @remarks The title in lower case, for searching. */
    titlelc: string;
  }

  interface PreparedModule extends Omit<Module.Source, "authors">, _PreparedPackage {
    /** @remarks The title in lower case, for searching. */
    titlelc: string;
  }

  interface PackageTab<Entry> {
    packages: Entry[];

    /** @remarks The number of installed packages of this type. */
    count: number;

    viewMode: ViewModeId;

    /** @remarks The template of the tab's view mode. */
    template: string;

    icon: string;

    /** @remarks Whether an "Update All" of this package type is in progress. */
    updatingAll: boolean;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    worlds: PackageTab<PreparedWorld>;

    systems: PackageTab<PreparedSystem>;

    modules: PackageTab<PreparedModule>;

    viewModes: ViewMode[];
  }

  interface Configuration<SetupPackages extends SetupPackages.Any = SetupPackages.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SetupPackages> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SetupPackages extends SetupPackages.Any = SetupPackages.Any> = DeepPartial<
    Configuration<SetupPackages>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {
    /** @remarks Re-read the favorite packages from the client setting before rendering. */
    refreshFavorites?: boolean | undefined;
  }

  interface ToggleLockOptions {
    /** The message to display. */
    message?: string | undefined;
  }
}

declare abstract class AnySetupPackages extends SetupPackages<
  SetupPackages.RenderContext,
  SetupPackages.Configuration,
  SetupPackages.RenderOptions
> {
  constructor(...args: never);
}

export default SetupPackages;
