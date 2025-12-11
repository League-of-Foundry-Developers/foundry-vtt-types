import type { Identity, InexactPartial } from "#utils";
import type { StringTree } from "./_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";

/**
 * A data structure for quickly retrieving objects by a string prefix.
 * Note that this works well for languages with alphabets (latin, cyrillic, korean, etc.), but may need more nuanced
 * handling for languages that compose characters and letters.
 */
declare class WordTree<DocumentName extends Document.Type, Key = string> extends StringTree<
  WordTree.Entry<DocumentName>,
  Key
> {
  /**
   * Insert an entry into the tree.
   * @param string - The string key for the entry.
   * @param entry - The entry to store.
   * @returns The node the entry was added to.
   */
  addLeaf(key: Key, entry: WordTree.Entry<DocumentName>): WordTree.EntryNode<DocumentName>;

  /**
   * Return entries that match the given string prefix.
   * @param prefix  - The prefix.
   * @param options - Additional options to configure behaviour.
   * @returns A number of entries that have the given prefix.
   */
  lookup(prefix: Key, options?: WordTree.LookupOptions<DocumentName>): WordTree.Entry<DocumentName>[];

  /**
   * Returns the node at the given prefix.
   * @param prefix - The prefix.
   * @returns The node
   * @remarks Calls super with no way to provide options, meaning `undefined` is never allow
   */
  nodeAtPrefix(prefix: Key): WordTree.EntryNode<DocumentName> | undefined;
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

  interface LookupOptions<DocumentName extends Document.Type>
    extends Omit<StringTree.LookupOptions<Entry<DocumentName>>, "limit">, _LookupOptions {}

  /**
   * A leaf entry in the tree.
   */
  interface Entry<DocumentName extends Document.Type> {
    /** An object that this entry represents. */
    // TODO(LukeAbby): This appears to be possible to be a compendium index entry.
    entry: Document.ImplementationFor<DocumentName>;

    /** The document type. */
    documentName: DocumentName;

    /** The document's UUID. */
    uuid: string;

    /** The (optional) pack ID. */
    pack?: string;
  }

  namespace Entry {
    type Any = Entry<Document.Type>;
  }

  type EntryNode<DocumentName extends Document.Type> = StringTree.Node<Entry<DocumentName>>;

  namespace EntryNode {
    type Any = WordTree.EntryNode<Document.Type>;
  }
}

export default WordTree;

declare abstract class AnyWordTree extends WordTree<Document.Type, string> {
  constructor(...args: never);
}
