declare class Journal extends Collection<JournalEntry> {
  // @TODO Add Journal class
  [key: string]: any;
}

/**
 * The JournalEntry class
 * @extends {Entity}
 */
declare class JournalEntry<D extends JournalEntry.Data = JournalEntry.Data> extends Entity<D> {
  /** @override */
  static get config (): EntityConfig

  /**
   * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
   */
  get visible (): boolean

  /**
   * Return a reference to the Note instance for this JournalEntry in the current Scene, if any
   */
  get sceneNote (): Note;

  /** @override */
  _onCreate (data: D, options: EntityCreateOptions, userId: string): void

  /** @override */
  _onUpdate (data: D, options: EntityUpdateOptions, userId: string): void

  /** @override */
  _onDelete (options: EntityDeleteOptions, userId: string): void

  /* -------------------------------------------- */
  /*  Methods
  /* -------------------------------------------- */

  /**
   * Show the JournalEntry to connected players.
   * By default the entry will only be shown to players who have permission to observe it.
   * If the parameter force is passed, the entry will be shown to all players regardless of normal permission.
   *
   * @param mode -   Which JournalEntry mode to display? Default is text.
   * @param force -  Display the entry to all players regardless of normal permissions
   */
  show (mode?: string, force?: boolean): Promise<void>

  /**
   * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
   * The note will also be highlighted as if hovered upon by the mouse
   */
  panToNote ({ scale, duration }: {
    scale?: number
    duration?: number
  }): void
}

declare namespace JournalEntry {
  interface Data extends EntityData {
    content?: string
    folder?: string
    img?: string
    sort?: number
  }
}
