import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Note document within a parent Scene.
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class NoteConfig<
    Options extends DocumentSheet.Options = DocumentSheet.Options,
    Data extends object = NoteConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Note'>>> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("NOTE.ConfigTitle"),
     *   template: "templates/scene/note-config.html",
     *   width: 400,
     * })
     * ```
     */
    static get defaultOptions(): DocumentSheet.Options;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /**
     * @param event - (unused)
     * @override
     */
    protected _updateObject(
      event: Event,
      formData: NoteConfig.FormData
    ): Promise<ConfiguredDocumentClassForName<'Note'> | undefined>;

    /**
     * @override
     */
    close(options?: Application.CloseOptions): Promise<void>;
  }

  namespace NoteConfig {
    interface Data<Options extends DocumentSheet.Options>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Note'>>, Options> {
      entry: ConfiguredDocumentClassForName<'JournalEntry'> | {};
      entries: Journal['contents'];
      icons: CONFIG['JournalEntry']['noteIcons'];
      fontFamilies: Record<string, string>;
      textAnchors: Record<foundry.CONST.TextAnchorPoint, string>;
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
      textAnchor: foundry.CONST.TextAnchorPoint;
      textColor: string;
      x: number | null;
      y: number | null;
    }
  }
}
