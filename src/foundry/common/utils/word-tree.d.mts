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
   * @param options.limit       - The maximum number of items to retrieve. Defaults to 10. It is important
   *                              to set this value as very short prefixes will naturally match large numbers
   *                              of entries.
   * @returns                   A number of entries that have the given prefix.
   */
  lookup(prefix: string, options?: InexactPartial<{ limit: number }>): WordTree.WordTreeEntry[];
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
   * @property  entry          - An object that this entry represents.
   * @property  documentName   - The document type.
   * @property  uuid           - The document's UUID.
   * @property  pack           - The (optional) pack ID.
   */
  interface WordTreeEntry {
    entry: Document;
    documentName: string;
    uuid: string;
    pack?: string;
  }
}

export default WordTree;
