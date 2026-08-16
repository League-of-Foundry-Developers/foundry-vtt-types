import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type CategoryBrowser from "../api/category-browser.d.mts";

import DataField = foundry.data.fields.DataField;

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
  static override DEFAULT_OPTIONS: SettingsConfig.DefaultOptions;

  /**
   * @remarks Menus and settings the current user may not configure are omitted entirely, so the
   * categories a GM sees and the ones a player sees differ.
   *
   * @privateRemarks Synchronous at runtime; kept as the base's `MaybePromise` return so subclasses
   * may remain asynchronous.
   */
  protected override _prepareCategoryData(): MaybePromise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  /**
   * Classify what Category an Action belongs to
   * @param namespace - The entry to classify
   * @returns The category the entry belongs to
   *
   * @remarks A namespace belonging to neither `core`, the active system, nor an installed module is
   * grouped under `unmapped`.
   */
  protected _categorizeEntry(namespace: string): SettingsConfig.Category;

  /**
   * Sort categories in order of core, system, and finally modules.
   */
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  /**
   * Confirm if the user wishes to reload the application.
   * @param options - Additional options to configure the prompt.
   *
   * @remarks Resolves without reloading anything if the user dismisses the prompt.
   */
  static reloadConfirm(options?: SettingsConfig.ReloadConfirmOptions): Promise<void>;

  static #SettingsConfig: true;
}

declare namespace SettingsConfig {
  interface Any extends AnySettingsConfig {}
  interface AnyConstructor extends Identity<typeof AnySettingsConfig> {}

  interface ReloadConfirmOptions {
    /**
     * Whether to reload all connected clients as well.
     *
     * @defaultValue `false`
     */
    world?: boolean | undefined;
  }

  interface Category {
    id: string;
    label: string;
  }

  interface MenuEntry {
    key: string;
    icon: string;
    label: string;
    hint: string;
    menu: true;
    buttonText: string;
  }

  interface SettingEntry {
    /**
     * @remarks Read from the registered setting's `value` property, which registration does not
     * define, so this is `undefined` for every core setting.
     */
    label: string | undefined;

    value: unknown;
    menu: false;

    /**
     * @remarks A setting not registered with a {@linkcode foundry.data.fields.DataField | DataField}
     * gets one synthesized from its `type`, `choices` and `range`.
     */
    field: DataField.Any;

    /** @remarks Only carried over for a setting registered with a `DataField`. */
    input?: DataField.CustomFormInput | undefined;

    /** @remarks Only set for a `filePicker: "folder"` setting, whose paths cannot be a `FilePathField`. */
    folderPicker?: boolean | undefined;
  }

  type Entry = MenuEntry | SettingEntry;

  interface RenderContext<Entry extends SettingsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

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
