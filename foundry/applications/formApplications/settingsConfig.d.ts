/**
 * A game settings configuration application
 * This form renders the settings defined via the game.settings.register API which have config = true
 */
declare class SettingsConfig extends FormApplication<FormApplication.Options, SettingsConfig.Data> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   title: game.i18n.localize("SETTINGS.Title"),
   *   id: "client-settings",
   *   template: "templates/sidebar/apps/settings-config.html",
   *   width: 600,
   *   height: "auto",
   *   tabs: [
   *     {navSelector: ".tabs", contentSelector: ".content", initial: "core"}
   *   ]
   * })
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SettingsConfig.Data;

  /**
   * Handle activating the button to configure User Role permissions
   * @param event - The initial button click event
   */
  protected _onClickSubmenu(event: JQuery.ClickEvent): void;

  /**
   * Handle button click to reset default settings
   * @param event - The initial button click event
   */
  protected _onResetDefaults(event: JQuery.ClickEvent): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: SettingsConfig.FormData): Promise<void>;
}

declare namespace SettingsConfig {
  interface Data {
    canConfigure: boolean;
    data: Data.Data;
    systemTitle: Game['system']['data']['title'];
    user: User;
  }

  namespace Data {
    interface Data {
      core: {
        version: Game['data']['version'];
        menus: ClientSettings.CompleteMenuSetting[];
        settings: Setting[];
        none: boolean;
      };
      modules: Record<string, { title: string; menus: ClientSettings.CompleteMenuSetting[]; settings: Setting[] }>;
      system: {
        title: Game['system']['data']['title'];
        menus: ClientSettings.CompleteMenuSetting[];
        settings: Setting[];
        none: boolean;
      };
    }

    interface Setting extends Duplicated<ClientSettings.CompleteSetting> {
      hint: string;
      isCheckbox: boolean;
      isRange: boolean;
      isSelect: boolean;
      name: string;
      type: string;
      value: ReturnType<ClientSettings['get']>;
    }
  }

  interface FormData {
    [key: string]: unknown;
    'core.animateRollTable': boolean;
    'core.chatBubbles': boolean;
    'core.chatBubblesPan': boolean;
    'core.coneTemplateType': 'round' | 'flat';
    'core.language': string;
    'core.leftClickRelease': boolean;
    'core.lightAnimation': boolean;
    'core.maxFPS': number;
    'core.mipmap': boolean;
    'core.softShadows': boolean;
    'core.tokenDragPreview': boolean;
    'core.visionAnimation': boolean;
  }
}
