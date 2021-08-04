import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * The singleton collection of Folder documents which exist within the active World.
   * This Collection is accessible within the Game object as game.fog.
   *
   * @see {@link FogExploration} The FogExploration document
   */
  class Folders extends WorldCollection<typeof foundry.documents.BaseFolder, 'Folders'> {
    constructor(data?: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Folder>>>['data']['_source'][]);

    /**
     * Track which Folders are currently expanded in the UI
     */
    protected _expanded: Partial<Record<string, boolean>>;

    /** @override */
    static documentName: 'Folder';

    /** @override */
    render(force?: boolean, context?: Application.Options): void;

    /**
     * Refresh the display of any active JournalSheet instances where the folder list will change.
     */
    protected _refreshJournalEntrySheets(): void;
  }
}
