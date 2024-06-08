import type { MaybePromise } from "../../../../../types/utils.d.mts";

declare global {
  /** A management app for configuring which Tours are available or have been completed. */
  class ToursManagement extends PackageConfiguration {
    /** @remarks This is not implemented in {@link ToursManagement} and will throw. */
    protected override _updateObject(event: Event, formData?: object | undefined): Promise<never>;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "tours-management",
     *   title: game.i18n.localize("SETTINGS.Tours"),
     *   categoryTemplate: "templates/sidebar/apps/tours-management-category.html"
     * });
     * ```
     */
    static override get defaultOptions(): PackageConfiguration.Options;

    override _prepareCategoryData(): PackageConfiguration.CategoryData;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _onResetDefaults(event: JQuery.ClickEvent): void;

    /**
     * Handle Control clicks
     * @internal
     */
    protected _onClickControl(event: JQuery.ClickEvent): MaybePromise<unknown>;
  }

  namespace ToursManagement {
    interface TourData {
      category: string;
      id: string;
      title: string;
      description: string;
      cssClass: string;
      notes: string;
      status: string;
      canBePlayed?: boolean;
      startOrResume?: string;
    }
  }
}
