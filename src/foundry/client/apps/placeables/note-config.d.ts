import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Note document within a parent Scene.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class NoteConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = NoteConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Note'>>> {
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
    static override get defaultOptions(): DocumentSheetOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    protected override _updateObject(event: Event, formData: NoteConfig.FormData): Promise<unknown>;

    override close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace NoteConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Note'>>, Options> {
      entry: ConfiguredDocumentClassForName<'JournalEntry'> | {};
      entries: Journal['contents'];
      icons: CONFIG['JournalEntry']['noteIcons'];
      fontFamilies: Record<string, string>;
      textAnchors: Record<foundry.CONST.TEXT_ANCHOR_POINTS, string>;
      submitText: string;
    }

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
