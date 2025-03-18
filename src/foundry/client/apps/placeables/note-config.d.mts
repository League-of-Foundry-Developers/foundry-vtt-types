import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Note document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class NoteConfig<
    Options extends
      DocumentSheet.Options<NoteDocument.Implementation> = DocumentSheet.Options<NoteDocument.Implementation>,
  > extends DocumentSheet<Options, NoteDocument.Implementation> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("NOTE.ConfigTitle"),
     *   template: "templates/scene/note-config.html",
     *   width: 400,
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheet.Options<NoteDocument.Implementation>;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

    activateListeners(html: JQuery<HTMLElement>): void;

    protected _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    /**
     * Update disabled state of the custom icon field.
     */
    protected _updateCustomIcon(): void;

    /**
     * Update the list of pages.
     */
    protected _updatePageList(): void;

    protected _getSubmitData(updateData?: object | null): Record<string, unknown>;

    protected override _updateObject(event: Event, formData: NoteConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace NoteConfig {
    interface Any extends NoteConfig<any> {}

    /** @internal */
    type _FormData = Pick<
      NoteDocument,
      | "elevation"
      | "entryId"
      | "fontFamily"
      | "fontSize"
      | "global"
      | "iconSize"
      | "pageId"
      | "sort"
      | "text"
      | "textAnchor"
      | "textColor"
      | "x"
      | "y"
    >;

    interface FormData extends _FormData {
      "icon.selected": NoteDocument["texture"]["src"];

      /** @remarks Only appears in the form data if `icon.selected` is set to "Custom" (`""` value) */
      "icon.custom"?: NoteDocument["texture"]["src"];
    }
  }
}
