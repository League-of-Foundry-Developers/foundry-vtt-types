import type { InexactPartial } from "../../../types/utils.d.mts";

/**
 * A data structure representing a tree of string nodes with arbitrary object leaves.
 */
declare class StringTree<EntryType> {
  /**
   * The key symbol that stores the leaves of any given node.
   */
  // replaced the getter definition with a static property so that
  //    it can be referenced as part of the StringTreeNode interface
  // static get leaves(): symbol;
  static readonly leaves: unique symbol;

  static readonly #leaves: unique symbol;

  /**
   * Insert an entry into the tree.
   * @param strings  - The string parents for the entry.
   * @param entry    - The entry to store.
   * @returns   The node the entry was added to.
   */
  addLeaf(strings: string[], entry: EntryType): StringTree.StringTreeNode;

  /**
   * Traverse the tree along the given string path and return any entries reachable from the node.
   * @param strings         - The string path to the desired node.
   * @param options         - Additional options to configure behaviour.
   * @returns    The reachable entries
   */
  lookup(
    strings: string[],
    options?: InexactPartial<{
      /** The maximum number of items to retrieve. */
      limit: number;
      /** A filter function to apply to each candidate entry. */
      filterEntries?: StringTree.StringTreeEntryFilter | undefined;
    }>,
  ): StringTree.StringTreeNode[];

  /**
   * Returns the node at the given path through the tree.
   * @param strings                     - The string path to the desired node.
   * @param options                     - Additional options to configure behaviour.
   * @returns The node at the path, if found
   */
  nodeAtPrefix(
    strings: string[],
    options?: InexactPartial<{
      /**
       * Only return the most recently visited node that has
       * leaves, otherwise return the exact node at the prefix,
       * if it exists. Defaults to false.
       */
      hasLeaves: boolean;
    }>,
  ): StringTree.StringTreeNode | void;

  /**
   * Perform a breadth-first search starting from the given node and retrieving any entries reachable from that node,
   * until we reach the limit.
   * @param node            - The starting node.
   * @param entries         - The accumulated entries.
   * @param queue           - The working queue of nodes to search.
   * @param options         - Additional options to configure behaviour.
   */
  protected _breadthFirstSearch(
    node: StringTree.StringTreeNode,
    entries: EntryType[],
    queue: StringTree.StringTreeNode[],
    options?: InexactPartial<{
      /** The maximum number of entries to retrieve before stopping. */
      limit: number;
    }>,
  ): void;
}

declare namespace StringTree {
  /**
   * A string tree node consists of zero-or-more string keys, and a leaves property that contains any objects that
   * terminate at the current node.
   */
  interface StringTreeNode {
    [StringTree.leaves]: Record<string, unknown>[];
    [key: string]: StringTreeNode;
  }

  /**
   * @param entry   - The entry to filter.
   * @returns Whether the entry should be included in the result set.
   */
  type StringTreeEntryFilter = (entry: unknown) => boolean;
}

export default StringTree;
