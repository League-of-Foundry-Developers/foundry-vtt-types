import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Settings: Settings.Any;
    }
  }
}

/**
 * The sidebar settings tab.
 */
declare class Settings<
  RenderContext extends Settings.RenderContext = Settings.RenderContext,
  Configuration extends Settings.Configuration = Settings.Configuration,
  RenderOptions extends Settings.RenderOptions = Settings.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     title: "SIDEBAR.TabSettings"
   *   },
   *   actions: {
   *     openApp: Settings.#onOpenApp,
   *     notifyUpdate: Settings.#onNotifyUpdate
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: Settings.DefaultOptions;

  /** @defaultValue `"settings"` */
  static override tabName: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   settings: {
   *     template: "templates/sidebar/tabs/settings.hbs",
   *     root: true
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Demo mode disables all `can*` flags; only GMs receive update notices.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  static #SettingsStatic: true;
}

declare namespace Settings {
  interface Any extends AnySettings {}
  interface AnyConstructor extends Identity<typeof AnySettings> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    /** The active system. */
    system: foundry.packages.System;

    /** The release the world is running on. */
    release: foundry.config.ReleaseData["_source"];

    /** The human-readable release string. */
    versionDisplay: string;

    canConfigure: boolean;

    canEditWorld: boolean;

    canManagePlayers: boolean;

    canReturnSetup: boolean;

    /** The number of active modules. */
    modules: number;

    /** The combined count of validation failures, package compatibility errors and usability issues. */
    issues: number;

    isDemo: boolean;

    /** The localized core update notice, or `null` when there is no update or the user is not a GM. */
    coreUpdate: string | null;

    /** The localized system update notice, or `null` when there is no update or the user is not a GM. */
    systemUpdate: string | null;
  }

  interface Configuration<Settings extends Settings.Any = Settings.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<Settings> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Settings extends Settings.Any = Settings.Any> = DeepPartial<Configuration<Settings>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnySettings extends Settings<
  Settings.RenderContext,
  Settings.Configuration,
  Settings.RenderOptions
> {
  constructor(...args: never);
}

export default Settings;
