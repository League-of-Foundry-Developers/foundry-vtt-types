import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

declare class DisclosureWidget {
  constructor(node: PMNode, view: EditorView, getPos: () => number);

  contentDOM: HTMLDetailsElement;
  dom: HTMLDetailsElement;
  getPos: () => number;

  update(node: PMNode): boolean;

  static view(node: PMNode, view: EditorView, getPos: () => number): DisclosureWidget;

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
