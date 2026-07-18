import type { Identity, InexactPartial } from "#utils";
import type CategoryBrowser from "../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SettingsConfig: SettingsConfig.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing the client and world settings for this world.
 * This form renders the settings defined via the game.settings.register API which have config = true
 */
declare class SettingsConfig<
  Entry extends SettingsConfig.Entry = SettingsConfig.Entry,
  RenderContext extends SettingsConfig.RenderContext<Entry> = SettingsConfig.RenderContext<Entry>,
  Configuration extends SettingsConfig.Configuration = SettingsConfig.Configuration,
  RenderOptions extends SettingsConfig.RenderOptions = SettingsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "settings-config",
   *   window: {
   *     title: "SETTINGS.Title",
   *     icon: "fa-solid fa-gears",
   *     resizable: true
   *   },
   *   position: {
   *     width: 780,
   *     height: 680
   *   },
   *   form: {
   *     handler: SettingsConfig.#onSubmit
   *   },
   *   actions: {
   *     openSubmenu: SettingsConfig.#onOpenSubmenu,
   *     resetDefaults: SettingsConfig.#onResetDefaults
   *   },
   *   initialCategory: "core",
   *   subtemplates: {
   *     category: "templates/settings/config-category.hbs",
   *     sidebarFooter: "templates/category-browser/reset.hbs"
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CategoryBrowser.DefaultOptions;

  protected _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  /**
   * Classify what Category an Action belongs to
   * @param namespace - The entry to classify
   * @returns The category the entry belongs to
   */
  protected _categorizeEntry(namespace: string): SettingsConfig.CategoryLabel;

  /**
   * Sort categories in order of core, system, and finally modules.
   */
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  /**
   * Confirm if the user wishes to reload the application.
   * @param options - Additional options to configure the prompt. (default: `{}`)
   */
  static reloadConfirm(options?: SettingsConfig.ReloadConfirmOptions): Promise<void>;

  #SettingsConfig: true;
}

declare namespace SettingsConfig {
  interface Any extends AnySettingsConfig {}
  interface AnyConstructor extends Identity<typeof AnySettingsConfig> {}

  interface MenuEntry {
    menu: true;
    buttonText: string;
    hint: string;
    icon: string;
    key: string;
    label: string;
  }

  interface SettingEntry {
    menu: false;
    field: foundry.data.fields.DataField.Any;
    label: string | undefined;
    value: unknown;

    /** Only set if `field` was originally defined with a `DataField`. */
    input?: foundry.data.fields.DataField.CustomFormInput | undefined;

    /** Only set for a `filePicker` setting whose categories resolved to a folder path (not a `FilePathField`). */
    folderPicker?: true | undefined;
  }

  type Entry = MenuEntry | SettingEntry;

  interface CategoryLabel {
    id: string;
    label: string;
  }

  interface _ReloadConfirmOptions {
    /**
     * Whether to reload all connected clients as well.
     * @defaultValue `false`
     */
    world: boolean;
  }

  interface ReloadConfirmOptions extends InexactPartial<_ReloadConfirmOptions> {}

  interface RenderContext<Entry extends SettingsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnySettingsConfig extends SettingsConfig<
  SettingsConfig.Entry,
  SettingsConfig.RenderContext<SettingsConfig.Entry>,
  SettingsConfig.Configuration,
  SettingsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SettingsConfig;
