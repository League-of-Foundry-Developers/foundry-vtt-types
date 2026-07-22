import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

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
  static override DEFAULT_OPTIONS: AbstractSidebarTab.DefaultOptions;

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

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  static #Settings: true;
}

declare namespace Settings {
  interface Any extends AnySettings {}
  interface AnyConstructor extends Identity<typeof AnySettings> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    system: foundry.packages.System;
    release: foundry.config.ReleaseData;
    versionDisplay: string;
    canConfigure: boolean;
    canEditWorld: boolean;
    canManagePlayers: boolean;
    canReturnSetup: boolean;
    modules: number;
    issues: number;
    isDemo: boolean;
    coreUpdate: string | null;
    systemUpdate: string | null;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}

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
