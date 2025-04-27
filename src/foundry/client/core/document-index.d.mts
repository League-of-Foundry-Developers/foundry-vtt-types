import type Document from "#common/abstract/document.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "#common/constants.d.mts";

declare global {
  /**
   * This class is responsible for indexing all documents available in the world and storing them in a word tree structure
   * that allows for fast searching.
   */
  class DocumentIndex {
    constructor();
    /**
     * A collection of WordTree structures for each document type.
     * @defaultValue `{}`
     */
    trees: Record<string, foundry.utils.WordTree>;

    /**
     * A reverse-lookup of a document's UUID to its parent node in the word tree.
     * @defaultValue `{}`
     */
    uuids: Record<string, foundry.utils.StringTree.StringTreeNode<DocumentIndex.Leaf>>;

    /**
     * Returns a Promise that resolves when the indexing process is complete.
     */
    get ready(): Promise<void> | null;

    /**
     * Index all available documents in the world and store them in a word tree.
     */
    index(): Promise<void>;

    /**
     * Return entries that match the given string prefix.
     * @param prefix  - The prefix.
     * @param options - Additional options to configure behaviour.
     * @returns A number of entries that have the given prefix, grouped by document type.
     */
    lookup(
      prefix: string,
      options?: {
        /**
         * The maximum number of items per document type to retrieve. It is important to set this
         * value as very short prefixes will naturally match large numbers of entries. (default: `10`)
         * (default: `10`)
         */
        limit?: number;
        /**
         * Optionally provide an array of document types. Only entries of that type
         * will be searched for. (default: `[]`)
         */
        documentTypes?: string[];
        /**
         * A filter function to apply to each candidate entry.
         */
        filterEntries?: foundry.utils.StringTree.StringTreeEntryFilter;
        /**
         * Only return entries that the user meets this ownership level for.
         */
        ownership?: DOCUMENT_OWNERSHIP_LEVELS;
      },
    ): Record<string, foundry.utils.WordTree.WordTreeEntry[]>;

    /**
     * Add an entry to the index.
     * @param doc - The document entry.
     */
    addDocument(doc: foundry.abstract.Document.Any): void;

    /**
     * Remove an entry from the index.
     * @param doc - The document entry.
     */
    removeDocument(doc: foundry.abstract.Document.Any): void;

    /**
     * Replace an entry in the index with an updated one.
     * @param doc - The document entry.
     */
    replaceDocument(doc: foundry.abstract.Document.Any): void;

    /**
     * Add a leaf node to the word tree index.
     * @param doc     - The document or compendium index entry to add.
     * @param options - Additional information for indexing.
     * @internal
     */
    protected _addLeaf(
      doc: foundry.abstract.Document.Any,
      options?: {
        /** The compendium that the index belongs to. */
        pack?: CompendiumCollection.Any;
      },
    ): void;

    /**
     * Aggregate the compendium index and add it to the word tree index.
     * @param pack - The compendium pack.
     * @internal
     */
    protected _indexCompendium(pack: CompendiumCollection.Any): void;

    /**
     * Add all of a parent document's embedded documents to the index.
     * @param parent - The parent document.
     * @internal
     */
    protected _indexEmbeddedDocuments(parent: foundry.abstract.Document.Any): void;

    /**
     * Aggregate all documents and embedded documents in a world collection and add them to the index.
     * @param documentName - The name of the documents to index.
     * @internal
     */
    protected _indexWorldCollection(documentName: string): void;
  }

  namespace DocumentIndex {
    interface Leaf {
      // TODO(LukeAbby): This appears to be possible to be a compendium index entry.
      doc: Document.Any;
      documentName: string;
      uuid: string;
    }
  }
}
