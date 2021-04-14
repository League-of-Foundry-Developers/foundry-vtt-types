/**
 * Placeable Note configuration sheet
 * @typeParam P - the type of the options object
 */
declare class NoteConfig<P extends FormApplication.Options = FormApplication.Options> extends FormApplication<
  P,
  NoteConfig.Data,
  Note
> {
  /**
   * @param note    - The Note object for which settings are being configured
   * @param options - Additional Application options
   */
  constructor(note: Note, options?: Partial<P>);

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "note-config",
   *   title: game.i18n.localize("NOTE.ConfigTitle"),
   *   template: "templates/scene/note-config.html",
   *   width: 400
   * });
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): NoteConfig.Data;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: NoteConfig.FormData): Promise<Note>;

  /**
   * @override
   */
  close(options?: Application.CloseOptions): Promise<void>;
}

declare namespace NoteConfig {
  interface Data {
    entryIcons: typeof CONFIG.JournalEntry['noteIcons'];
    entryId: JournalEntry['_id'] | undefined;
    entryName: JournalEntry['name'] | undefined;
    entries: Journal['entities'];
    fontFamilies: Partial<Record<string, string>>;
    object: foundry.utils.Duplicated<NoteConfig['object']['data']>;
    options: NoteConfig['options'];
    textAnchors: Record<foundry.CONST.TextAnchorPoint, string>;
  }

  interface FormData {
    entryId: Note.Data['entryId'];
    fontFamily: Note.Data['fontFamily'];
    fontSize: Note.Data['fontSize'] | null;
    icon: Note.Data['icon'];
    iconSize: Note.Data['iconSize'] | null;
    iconTint: Note.Data['iconTint'];
    text: Note.Data['text'];
    textAnchor: Note.Data['textAnchor'];
    textColor: Note.Data['textColor'];
    x: Note.Data['x'] | null;
    y: Note.Data['y'] | null;
  }
}
