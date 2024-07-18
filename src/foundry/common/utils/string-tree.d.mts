/**
 * A data structure representing a tree of string nodes with arbitrary object leaves.
 */
declare class StringTree {
  /**
   * The key symbol that stores the leaves of any given node.
   * @type {symbol}
   */
  static get leaves(): symbol;

  static #leaves: symbol;

  /**
   * The tree's root.
   * @type {StringTreeNode}
   */
  #root: StringTree.StringTreeNode;

  /**
   * Create a new node.
   * @returns   The new node
   */
  #createNode(): StringTree.StringTreeNode;

  /**
   * Insert an entry into the tree.
   * @param strings  - The string parents for the entry.
   * @param entry         - The entry to store.
   * @returns   The node the entry was added to.
   */
  addLeaf(strings: string[], entry: StringTree.StringTreeNode): StringTree.StringTreeNode;

  /**
   * Traverse the tree along the given string path and return any entries reachable from the node.
   * @param strings         - The string path to the desired node.
   * @param options         - Additional options to configure behaviour.
   * @param options.limit   - The maximum number of items to retrieve.
   * @returns    The reachable entries
   */
  lookup(strings: string[], options?: { limit?: number }): StringTree.StringTreeNode[];

  /**
   * Returns the node at the given path through the tree.
   * @param strings                     - The string path to the desired node.
   * @param options                     - Additional options to configure behaviour.
   * @param options.hasLeaves           - Only return the most recently visited node that has
   *                                      leaves, otherwise return the exact node at the prefix,
   *                                      if it exists. Defaults to false.
   * @returns The node at the path, if found
   */
  nodeAtPrefix(strings: string[], options?: { hasLeaves?: boolean }): StringTree.StringTreeNode | void;

  /**
   * Perform a breadth-first search starting from the given node and retrieving any entries reachable from that node,
   * until we reach the limit.
   * @param node            - The starting node.
   * @param entries         - The accumulated entries.
   * @param queue           - The working queue of nodes to search.
   * @param options         - Additional options to configure behaviour.
   * @param options.limit   - The maximum number of entries to retrieve before stopping.
   * @protected
   */
  _breadthFirstSearch(
    node: StringTree.StringTreeNode,
    entries: StringTree.StringTreeNode[],
    queue: StringTree.StringTreeNode[],
    options?: { limit?: number },
  ): void;
}

/**
 * A string tree node consists of zero-or-more string keys, and a leaves property that contains any objects that
 * terminate at the current node.
 */
declare namespace StringTree {
  type StringTreeNode = {
    [key: string]: StringTreeNode;
  };
}

export default StringTree;
