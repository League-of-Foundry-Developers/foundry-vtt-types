/**
 * The JournalEntry Configuration Sheet
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Entity which should be managed by this form sheet
 */
declare class JournalSheet<
  P extends JournalSheet.Options = JournalSheet.Options,
  D extends object = BaseEntitySheet.Data<JournalEntry>,
  O extends JournalEntry = D extends BaseEntitySheet.Data<infer T> ? T : JournalEntry
> extends BaseEntitySheet<P, D, O> {
  /**
   * @param entity  - The JournalEntry instance which is being edited
   * @param options - JournalSheet options
   */
  constructor(entity: O, options?: Partial<P>);

  protected _sheetMode: JournalSheet.SheetMode | null;

  /** @override */
  static get defaultOptions(): JournalSheet.Options;

  /** @override */
  get id(): string;

  /** @override */
  get template(): string;

  /** @override */
  get title(): string;

  /** @override */
  getData(options?: Application.RenderOptions): Promise<D> | D;

  /**
   * Guess the default view mode for the sheet based on the player's permissions to the Entry
   */
  protected _inferDefaultMode(): JournalSheet.SheetMode | null;

  /** @override */
  protected _render(force?: boolean, options?: JournalSheet.RenderOptions): Promise<void>;

  /** @override */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /** @override */
  protected _updateObject(event: Event, formData: object): Promise<O>;

  /**
   * Handle requests to switch the rendered mode of the Journal Entry sheet
   * Save the form before triggering the show request, in case content has changed
   */
  protected _onSwapMode(event: Event, mode: JournalSheet.SheetMode): Promise<void>;

  /**
   * Handle requests to show the referenced Journal Entry to other Users
   * Save the form before triggering the show request, in case content has changed
   */
  protected _onShowPlayers(event: Event): Promise<void>;
}

declare namespace JournalSheet {
  interface RenderOptions extends Application.RenderOptions {
    sheetMode?: SheetMode | null;
  }

  interface Options extends BaseEntitySheet.Options {
    /**
     * @defaultValue `['sheet', 'journal-sheet']`
     */
    classes: string[];
    /**
     * @defaultValue `720`
     */
    width: number;
    /**
     * @defaultValue `800`
     */
    height: number;
    /**
     * @defaultValue `true`
     */
    resizable: boolean;
    /**
     * @defaultValue `false`
     */
    closeOnSubmit: boolean;
    /**
     * @defaultValue `true`
     */
    submitOnClose: boolean;
    /**
     * @defaultValue {@link ENTITY_PERMISSIONS.NONE}
     */
    viewPermission: Const.EntityPermission;
    sheetMode?: SheetMode | null;
  }

  interface Data<O extends JournalEntry = JournalEntry> extends BaseEntitySheet.Data<O> {
    image: string;
    folders: Folder[];
  }

  type SheetMode = 'text' | 'image';
}
