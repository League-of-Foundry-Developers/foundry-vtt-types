import type { Attrs, NodeType } from "prosemirror-model";

declare module "prosemirror-model" {
  interface ResolvedPos {
    /**
     * Determine whether a given position has an ancestor node of the given type.
     * @param other - The other node type.
     * @param attrs - An object of attributes that must also match, if provided.
     * @privateRemarks {@linkcode foundry.prosemirror.ProseMirrorMenu._toggleBlock | ProseMirrorMenu#_toggleBlock} and
     * {@linkcode foundry.prosemirror.ProseMirrorMenu._toggleTextBlock | #_toggleTextBlock} call this with an `attrs`
     * parameter that has a default of `null`
     */
    hasAncestor(other: NodeType, attrs?: Attrs | null): boolean;
  }
}
