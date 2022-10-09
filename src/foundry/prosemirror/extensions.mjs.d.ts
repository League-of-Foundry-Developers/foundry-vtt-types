import { NodeType } from "prosemirror-model";
declare module "prosemirror-model" {
  interface ResolvedPos {
    /**
     * Determine whether a given position has an ancestor node of the given type.
     * @param other - The other node type.
     * @param attrs - An object of attributes that must also match, if provided.
     */
    hasAncestor(other: NodeType, attrs?: ReturnType<ResolvedPos["node"]>["attrs"]): boolean;
  }
}
