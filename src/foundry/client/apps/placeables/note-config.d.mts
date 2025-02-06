import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Note document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class NoteConfig<
    Options extends
      DocumentSheetOptions<NoteDocument.ConfiguredInstance> = DocumentSheetOptions<NoteDocument.ConfiguredInstance>,
  > extends DocumentSheet<Options, NoteDocument.ConfiguredInstance> {
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
    static override get defaultOptions(): DocumentSheetOptions<NoteDocument.ConfiguredInstance>;

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
    type Any = NoteConfig<any>;

    interface FormData {
      entryId: NoteDocument["entryId"];
      fontFamily: NoteDocument["fontFamily"];
      fontSize: NoteDocument["fontSize"];
      "icon.selected": NoteDocument["texture"]["src"];
      "icon.custom": NoteDocument["texture"]["src"];
      iconSize: NoteDocument["iconSize"];
      iconTint: NoteDocument["texture"]["tint"];
      text: NoteDocument["text"];
      textAnchor: NoteDocument["textAnchor"];
      textColor: NoteDocument["textColor"];
      x: NoteDocument["x"];
      y: NoteDocument["y"];
    }
  }
}
