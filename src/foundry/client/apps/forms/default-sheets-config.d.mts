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

    override _prepareCategoryData(): PackageConfiguration.CategoryData;

    protected _updateObject(event: Event, formData?: object): Promise<unknown>;

    protected _onResetDefaults(event: JQuery.ClickEvent): void;
  }

  namespace DefaultSheetsConfig {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Options extends PackageConfiguration.Options {}

    interface CategorySubType {
      type: string;
      name: string;
      defaultClasses: Record<string, string>;
      defaultClass: string;
    }

    interface Category extends PackageConfiguration.Category {
      count: number;
      subtypes: CategorySubType[];
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface CategoryData extends PackageConfiguration.CategoryData<Category> {}
  }
}
