import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single Note document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class NoteConfig<
    Options extends DocumentSheetOptions<NoteDocument> = DocumentSheetOptions<NoteDocument>,
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"Note">>> {
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
    static override get defaultOptions(): DocumentSheetOptions<NoteDocument>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    activateListeners(html: JQuery<HTMLElement>): void;

    protected _onChangeInput(event: JQuery.ChangeEvent<any, any, any, any>): void;

    /**
     * Update disabled state of the custom icon field.
     */
    protected _updateCustomIcon(): void;

    /**
     * Update the list of pages.
     */
    protected _updatePageList(): void;

    protected _getSubmitData(updateData?: object | null | undefined): Record<string, unknown>;

    protected override _updateObject(event: Event, formData: NoteConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace NoteConfig {
    interface FormData {
      entryId: string;
      fontFamily: string;
      fontSize: number | null;
      icon: string;
      iconSize: number | null;
      iconTint: string;
      text: string;
      textAnchor: foundry.CONST.TEXT_ANCHOR_POINTS;
      textColor: string;
      x: number | null;
      y: number | null;
    }
  }
}
