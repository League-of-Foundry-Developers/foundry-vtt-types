import type { AnyDocumentData } from "../../common/abstract/data.mjs";

declare global {
  /**
   * A data structure for quickly retrieving objects by a string prefix.
   * Note that this works well for languages with alphabets (latin, cyrillic, korean, etc.), but may need more nuanced
   * handling for languages that compose characters and letters.
   */
  class WordTree {
    /**
     * Create a new node.
     */
    get node(): WordTree.Node;

    /**
     * Insert an entry into the tree.
     * @param string - The string key for the entry.
     * @param entry  - The entry to store.
     * @returns The node the entry was added to.
     */
    addLeaf(string: string, entry: WordTree.Entry): WordTree.Node;

    /**
     * Return entries that match the given string prefix.
     * @param prefix  - The prefix.
     * @param options - Additional options to configure behaviour.
     * @returns A number of entries that have the given prefix.
     */
    lookup(
      prefix: string,
      options?: {
        /**
         * The maximum number of items to retrieve. It is important to set this value as
         * very short prefixes will naturally match large numbers of entries. (default: `10`)
         */
        limit: number;
      }
    ): WordTree.Entry[];

    /**
     * Returns the node at the given prefix.
     * @param prefix - The prefix.
     */
    nodeAtPrefix(prefix: string): WordTree.Node;

    /**
     * Perform a breadth-first search starting from the given node and retrieving any entries along the way, until we
     * reach the limit.
     * @param node    - The starting node.
     * @param entries - The accumulated entries.
     * @param queue   - The working queue of nodes to search.
     * @param options - Additional options for the search.
     * @internal
     */
    protected _breadthFirstSearch(
      node: WordTree.Node,
      entries: WordTree.Entry[],
      queue: WordTree.Node[],
      options?: {
        /** The maximum number of entries to retrieve before stopping. (default: `10`) */
        limit: 10;
      }
    ): void;
  }
  export namespace WordTree {
    /**
     * A leaf entry in the tree.
     */
    interface Entry {
      /** An object that this entry represents. */
      entry: Document | object;

      /** The document type. */
      documentName: string;

      /** The document's UUID. */
      uuid: string;

      /** The pack ID. */
      pack?: string;
    }

    /**
     * A word tree node consists of zero or more 1-character keys, and a leaves property that contains any objects that
     * terminate at the current string prefix.
     */
    interface Node {
      /** Any leaves at this node. */
      leaves: Entry[];
    }
  }

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
    trees: Record<string, WordTree>;

    /**
     * A reverse-lookup of a document's UUID to its parent node in the word tree.
     * @defaultValue `{}`
     */
    uuids: Record<string, WordTree.Node>;

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
     * A number of entries that have the given prefix, grouped by document type.
     */
    lookup(
      prefix: string,
      options?: {
        /**
         * The maximum number of items per document type to retrieve. It is important to set this
         * value as very short prefixes will naturally match large numbers of entries. (default: `10`)
         */
        limit?: number;
        /**
         * Optionally provide an array of document types. Only entries of that type
         * will be searched for. (default: `[]`)
         */
        documentTypes?: string[];
      }
    ): Record<string, WordTree.Entry[]>;

    /**
     * Add an entry to the index.
     * @param doc - The document entry.
     */
    addDocument(doc: foundry.abstract.Document<any, any>): void;

    /**
     * Remove an entry from the index.
     * @param doc - The document entry.
     */
    removeDocument(doc: foundry.abstract.Document<any, any>): void;

    /**
     * Replace an entry in the index with an updated one.
     * @param doc - The document entry.
     */
    replaceDocument(doc: foundry.abstract.Document<any, any>): void;

    /**
     * Add a leaf node to the word tree index.
     * @param doc     - The document or compendium index entry to add.
     * @param options - Additional information for indexing.
     * @internal
     */
    protected _addLeaf(
      doc: foundry.abstract.Document<any, any> | AnyDocumentData,
      options?: {
        /** The compendium that the index belongs to. */
        pack?: CompendiumCollection<any>;
      }
    ): void;

    /**
     * Aggregate the compendium index and add it to the word tree index.
     * @param pack - The compendium pack.
     * @internal
     */
    protected _indexCompendium(pack: CompendiumCollection<any>): void;

    /**
     * Add all of a parent document's embedded documents to the index.
     * @param parent - The parent document.
     * @internal
     */
    protected _indexEmbeddedDocuments(parent: foundry.abstract.Document<any, any>): void;

    /**
     * Aggregate all documents and embedded documents in a world collection and add them to the index.
     * @param documentName - The name of the documents to index.
     * @internal
     */
    protected _indexWorldCollection(documentName: string): void;
  }
}
