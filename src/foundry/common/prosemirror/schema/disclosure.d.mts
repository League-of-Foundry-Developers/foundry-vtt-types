import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

/**
 * ProseMirror implementation of the HTML disclosure widget.
 */
declare class DisclosureWidget {
  /**
   * @param node   - The node this view represents.
   * @param view   - The parent EditorView.
   * @param getPos - A function that returns the node's current position.
   */
  constructor(node: PMNode, view: EditorView, getPos: () => number);

  /** The DOM node to render the document node's children into. */
  contentDOM: HTMLDetailsElement;

  /** The outer DOM node that represents the document node. */
  dom: HTMLDetailsElement;

  /** A function that returns the node's current position. */
  getPos: () => number;

  /**
   * When the EditorView updates itself, determine if this view can update to the given node.
   * @param node - The node.
   */
  update(node: PMNode): boolean;

  /**
   * Static instantiator function for the NodeView that can be passed to a new EditorView.
   * @param node   - The node this view represents.
   * @param view   - The parent EditorView.
   * @param getPos - A function that returns the node's current position.
   */
  static view(node: PMNode, view: EditorView, getPos: () => number): DisclosureWidget;

  /**
   * Return the specs for the disclosure widget nodes.
   */
  static get nodes(): DisclosureWidget.Nodes;

  #DisclosureWidget: true;
}

declare namespace DisclosureWidget {
  interface Nodes {
    details: NodeSpec;
    summary: NodeSpec;
  }
}

export default DisclosureWidget;
