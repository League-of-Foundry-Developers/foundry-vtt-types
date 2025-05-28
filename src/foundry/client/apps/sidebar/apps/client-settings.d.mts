import Game = foundry.Game;

export {};

declare global {
  /**
   * The Application responsible for displaying and editing the client and world settings for this world.
   * This form renders the settings defined via the game.settings.register API which have config = true
   * @template Options - The type of the options object
   */
  class SettingsConfig<
    Options extends FormApplication.Options = FormApplication.Options,
  > extends PackageConfiguration<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("SETTINGS.Title"),
     *   id: "client-settings",
     *   template: "templates/sidebar/apps/settings-config.html",
     *   submitButton: true
     * })
     * ```
     */
    static override get defaultOptions(): typeof FormApplication.defaultOptions;

    override _prepareCategoryData(): SettingsConfig.CategoryData;

    override activateListeners(html: JQuery): void;

    /**
     * Handle activating the button to configure User Role permissions
     * @param event - The initial button click event
     * @internal
     */
    protected _onClickSubmenu(event: JQuery.ClickEvent): void;

    /**
     * Preview font scaling as the setting is changed.
     * @param event - The triggering event.
     * @internal
     */
    protected _previewFontScaling(event: JQuery.ChangeEvent): void;

    override close(options?: Application.CloseOptions): Promise<void>;

    protected override _updateObject(event: Event, formData: SettingsConfig.FormData): Promise<unknown>;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     * @internal
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): void;

    /**
     * Confirm if the user wishes to reload the application
     * @param options - Additional options to configure the prompt
     */
    static reloadConfirm(options?: {
      /**
       * Whether to reload all connected clients as well.
       * @defaultValue `false`
       */
      world: boolean;
    }): Promise<void>;
  }

  namespace SettingsConfig {
    interface Any extends SettingsConfig<any> {}

    interface Category extends PackageConfiguration.Category {
      menus: ClientSettings.SettingSubmenuConfig[];
      settings: SettingConfig[];
      count: number;
    }

    interface CategoryData extends PackageConfiguration.CategoryData<Category> {
      user: Game["user"];
      canConfigure: boolean;
    }

    interface FormData {
      "core.animateRollTable": boolean;
      "core.chatBubbles": boolean;
      "core.chatBubblesPan": boolean;
      "core.coneTemplateType": "round" | "flat";
      "core.language": string;
      "core.leftClickRelease": boolean;
      "core.lightAnimation": boolean;
      "core.maxFPS": number;
      "core.mipmap": boolean;
      "core.noCanvas": boolean;
      "core.softShadows": boolean;
      "core.tokenDragPreview": boolean;
      "core.visionAnimation": boolean;
      [key: string]: unknown;
    }
  }
}
