import type { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for displaying and editing a single Setting document.
   * This form renders the settings defined via the game.settings.register API which have config = true
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class SettingsConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends object = SettingsConfig.Data
  > extends FormApplication<Options, Data> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("SETTINGS.Title"),
     *   id: "client-settings",
     *   template: "templates/sidebar/apps/settings-config.html",
     *   width: 600,
     *   height: "auto",
     *   tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "core" }],
     * })
     * ```
     */
    static get defaultOptions(): typeof FormApplication['defaultOptions'];

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Handle activating the button to configure User Role permissions
     * @param event - The initial button click event
     * @internal
     */
    protected _onClickSubmenu(event: JQuery.ClickEvent): void;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     * @internal
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): void;

    /** @override */
    protected _updateObject(event: Event, formData: SettingsConfig.FormData): Promise<void>;
  }

  namespace SettingsConfig {
    interface Data {
      user: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>>;
      canConfigure: boolean;
      systemTitle: Game['system']['data']['title'];
      data: Data.Data;
    }

    namespace Data {
      interface Data {
        core: {
          version: string;
          menus: SettingSubmenuConfig[];
          settings: Setting[];
          none: boolean;
        };
        system: {
          title: Game['system']['data']['title'];
          menus: SettingSubmenuConfig[];
          settings: Setting[];
          none: boolean;
        };
        modules: { title: string; menus: SettingSubmenuConfig[]; settings: Setting[] }[];
      }

      interface Setting extends Omit<SettingConfig, 'type'> {
        id: string;
        name: string;
        hint: string;
        value: unknown;
        type: string;
        isCheckbox: boolean;
        isSelect: boolean;
        isRange: boolean;
        filePickerType: FilePicker.Type | undefined;
      }
    }

    interface FormData {
      'core.animateRollTable': boolean;
      'core.chatBubbles': boolean;
      'core.chatBubblesPan': boolean;
      'core.coneTemplateType': 'round' | 'flat';
      'core.language': string;
      'core.leftClickRelease': boolean;
      'core.lightAnimation': boolean;
      'core.maxFPS': number;
      'core.mipmap': boolean;
      'core.noCanvas': boolean;
      'core.softShadows': boolean;
      'core.tokenDragPreview': boolean;
      'core.visionAnimation': boolean;
      [key: string]: unknown;
    }
  }
}
