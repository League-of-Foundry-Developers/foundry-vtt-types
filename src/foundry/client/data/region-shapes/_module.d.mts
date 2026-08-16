// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

import type { PolygonTree, PolygonTreeNode } from "../polygon-tree.mjs";

export * from "./shape.mjs";

/**
 * @deprecated since v14
 * @remarks An alias for {@linkcode PolygonTree}. Foundry exports this as a `const`, so it is a
 * value only; use {@linkcode PolygonTree} where a type is needed.
 */
export declare const RegionPolygonTree: typeof PolygonTree;

/**
 * @deprecated since v14
 * @remarks An alias for {@linkcode PolygonTreeNode}. Foundry exports this as a `const`, so it is a
 * value only; use {@linkcode PolygonTreeNode} where a type is needed.
 */
export declare const RegionPolygonTreeNode: typeof PolygonTreeNode;
