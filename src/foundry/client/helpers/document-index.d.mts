import type Document from "#common/abstract/document.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "#common/constants.d.mts";
import type { Identity, InexactPartial } from "#utils";
import type { WordTree, StringTree } from "#common/utils/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * This class is responsible for indexing all documents available in the world.
 * Stores documents using a word tree structure that allows for efficient searching.
 */
declare class DocumentIndex {
  constructor();

  /**
   * A collection of WordTree structures for each document type.
   * @defaultValue `{}`
   */
  trees: DocumentIndex.WordTrees;

  /**
   * A reverse-lookup of a document's UUID to its parent node in the word tree.
   * @defaultValue `{}`
   */
  uuids: Record<string, StringTree.Node<DocumentIndex.Leaf>>;

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
  lookup(prefix: string, options?: DocumentIndex.LookupOptions): DocumentIndex.LookupReturn;

  /**
   * Add an entry to the index.
   * @param doc - The document entry.
   */
  addDocument(doc: DocumentIndex.AnyIndexedDocument): void;

  /**
   * Remove an entry from the index.
   * @param doc - The document entry.
   */
  removeDocument(doc: DocumentIndex.AnyIndexedDocument): void;

  /**
   * Replace an entry in the index with an updated one.
   * @param doc - The document entry.
   */
  replaceDocument(doc: DocumentIndex.AnyIndexedDocument): void;

  /**
   * Add a leaf node to the word tree index.
   * @param doc     - The document or compendium index entry to add.
   * @param options - Additional information for indexing.
   * @internal
   */
  protected _addLeaf(doc: DocumentIndex.AnyIndexedDocument, options?: DocumentIndex.AddLeafOptions): void;

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
  protected _indexEmbeddedDocuments(parent: Document.Any): void;

  /**
   * Aggregate all documents and embedded documents in a world collection and add them to the index.
   * @param documentName - The name of the documents to index.
   * @internal
   */
  protected _indexWorldCollection(documentName: DocumentIndex.IndexedDocumentNames): void;

  #DocumentIndex: true;
}

declare namespace DocumentIndex {
  interface Any extends AnyDocumentIndex {}
  interface AnyConstructor extends Identity<typeof AnyDocumentIndex> {}

  type IndexedDocumentNames = {
    [K in Document.Type]: Document.MetadataFor<K>["indexed"] extends true ? K : never;
  }[Document.Type];

  type AnyIndexedDocument = Document.ImplementationFor<IndexedDocumentNames>;

  /** @internal */
  type _WordTrees = { [K in IndexedDocumentNames]?: WordTree<K> };

  interface WordTrees extends _WordTrees {}

  /** @internal */
  type _LookupReturn = { [K in IndexedDocumentNames]?: WordTree.Entry<K>[] };

  interface LookupReturn extends _LookupReturn {}

  /**
   * @privateRemarks Since for {@linkcode DocumentIndex.uuids | #uuids} the keys are UUIDs not document names,
   * we can't (easily) infer the type of `entry` like we do with {@linkcode DocumentIndex.WordTrees}
   */
  interface Leaf {
    /** @remarks This Document (or index entry) is of the type specified in `documentName` */
    // TODO(LukeAbby): This appears to be possible to be a compendium index entry.
    entry: AnyIndexedDocument;

    documentName: IndexedDocumentNames;

    uuid: string;

    /** @remarks Only present if this is a Compendium UUID */
    pack?: string;
  }

  /** @internal */
  type _LookupOptions = InexactPartial<{
    /**
     * The maximum number of items per document type to retrieve. It is important to set this
     * value as very short prefixes will naturally match large numbers of entries.
     * @defaultValue `10`
     */
    limit: number;

    /**
     * Optionally provide an array of document types. Only entries of that type
     * will be searched for.
     * @defaultValue `[]`
     * @remarks If left empty, uses {@linkcode DocumentIndex.trees | Object.keys(this.trees)}
     */
    documentTypes: IndexedDocumentNames[];

    /**
     * A filter function to apply to each candidate entry.
     */
    filterEntries: foundry.utils.StringTree.EntryFilter<WordTree.Entry.Any>;

    /**
     * Only return entries that the user meets this ownership level for.
     */
    ownership: DOCUMENT_OWNERSHIP_LEVELS;
  }>;

  interface LookupOptions extends _LookupOptions {}

  type _AddLeafOptions = InexactPartial<{
    /** The compendium that the index belongs to. */
    pack?: CompendiumCollection.Any;
  }>;

  interface AddLeafOptions extends _AddLeafOptions {}
}

export default DocumentIndex;

declare abstract class AnyDocumentIndex extends DocumentIndex {
  constructor(...args: never);
}
