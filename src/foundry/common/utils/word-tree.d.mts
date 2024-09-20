import type { InexactPartial } from "../../../types/utils.d.mts";
import type StringTree from "./string-tree.d.mts";

/**
 * A data structure for quickly retrieving objects by a string prefix.
 * Note that this works well for languages with alphabets (latin, cyrillic, korean, etc.), but may need more nuanced
 * handling for languages that compose characters and letters.
 */
declare class WordTree extends StringTree<WordTree.WordTreeEntry> {
  /**
   * Insert an entry into the tree.
   * @param string    - The string key for the entry.
   * @param entry     - The entry to store.
   * @returns         The node the entry was added to.
   */
  addLeaf(string: string, entry: WordTree.WordTreeEntry): StringTree.StringTreeNode;
  addLeaf(strings: string[], entry: any): StringTree.StringTreeNode;

  /**
   * Return entries that match the given string prefix.
   * @param prefix              - The prefix.
   * @param options             - Additional options to configure behaviour.
   * @returns                   A number of entries that have the given prefix.
   */
  lookup(
    prefix: string,
    options?: InexactPartial<{
      /**
       * The maximum number of items to retrieve. It is important
       * to set this value as very short prefixes will naturally match large numbers
       * of entries.
       * (default: `10`)
       */
      limit: number;
      /** A filter function to apply to each candidate entry. */
      filterEntries?: StringTree.StringTreeEntryFilter | undefined;
    }>,
  ): WordTree.WordTreeEntry[];
  lookup(strings: string[], options?: InexactPartial<{ limit: number }>): StringTree.StringTreeNode[];

  /**
   * Returns the node at the given prefix.
   * @param prefix        - The prefix.
   * @returns The node
   */
  nodeAtPrefix(strings: string[], options?: InexactPartial<{ hasLeaves: boolean }>): StringTree.StringTreeNode | void;
  nodeAtPrefix(prefix: string): WordTree.WordTreeEntry;
}

declare namespace WordTree {
  /**
   * A leaf entry in the tree.
   */
  interface WordTreeEntry {
    /** An object that this entry represents. */
    entry: foundry.abstract.Document.Any;
    /** The document type. */
    documentName: string;
    /** The document's UUID. */
    uuid: string;
    /** The (optional) pack ID. */
    pack?: string;
  }
}

export default WordTree;
