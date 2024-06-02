export {};

declare global {
  class DefaultSheetsConfig<
    Options extends DefaultSheetsConfig.Options = DefaultSheetsConfig.Options,
  > extends PackageConfiguration<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("SETTINGS.DefaultSheetsL"),
     *   id: "default-sheets-config",
     *   categoryTemplate: "templates/sidebar/apps/default-sheets-config.html",
     *   submitButton: true
     * });
     * ```
     */
    static override get defaultOptions(): DefaultSheetsConfig.Options;

    override _prepareCategoryData(): PackageConfiguration.Category;

    protected _updateObject(event: Event, formData?: object | undefined): Promise<unknown>;

    protected _onResetDefaults(event: JQuery.ClickEvent): void;
  }

  namespace DefaultSheetsConfig {
    interface Options extends PackageConfiguration.Options {}
  }
}
