import type { Identity, InexactPartial } from "#utils";
import type StringTree from "./string-tree.d.mts";

/**
 * A data structure for quickly retrieving objects by a string prefix.
 * Note that this works well for languages with alphabets (latin, cyrillic, korean, etc.), but may need more nuanced
 * handling for languages that compose characters and letters.
 */
declare class WordTree<Key = string> extends StringTree<WordTree.Entry, Key> {
  /**
   * Insert an entry into the tree.
   * @param string - The string key for the entry.
   * @param entry - The entry to store.
   * @returns The node the entry was added to.
   */
  addLeaf(key: Key, entry: WordTree.Entry): StringTree.Node<WordTree.Entry>;

  /**
   * Return entries that match the given string prefix.
   * @param prefix  - The prefix.
   * @param options - Additional options to configure behaviour.
   * @returns A number of entries that have the given prefix.
   */
  lookup(prefix: Key, options?: WordTree.LookupOptions): WordTree.Entry[];

  /**
   * Returns the node at the given prefix.
   * @param prefix - The prefix.
   * @returns The node
   */
  nodeAtPrefix(prefix: Key): StringTree.Node<WordTree.Entry> | void;
}

declare namespace WordTree {
  interface Any extends AnyWordTree {}
  interface AnyConstructor extends Identity<typeof AnyWordTree> {}

  /** @internal */
  type _LookupOptions = InexactPartial<{
    /**
     * The maximum number of items to retrieve. It is important to set this value
     * as very short prefixes will naturally match large numbers of entries.
     * @defaultValue `10`
     */
    limit: number;
  }>;

  interface LookupOptions extends Omit<StringTree.LookupOptions, "limit">, _LookupOptions {}

  /**
   * A leaf entry in the tree.
   */
  interface Entry {
    /** An object that this entry represents. */
    // TODO(LukeAbby): This appears to be possible to be a compendium index entry.
    entry: foundry.abstract.Document.Any;

    /** The document type. */
    documentName: string;

    /** The document's UUID. */
    uuid: string;

    /** The (optional) pack ID. */
    pack?: string | undefined;
  }
}

export default WordTree;

declare abstract class AnyWordTree extends WordTree<string> {
  constructor(...args: never);
}
