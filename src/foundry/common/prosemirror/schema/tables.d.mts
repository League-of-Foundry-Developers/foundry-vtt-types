import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

export declare const builtInTableNodes: {
  table: NodeSpec;
  table_cell: NodeSpec;
  table_header: NodeSpec;
  table_row: NodeSpec;
};

export declare const tableComplex: RequiredProps<NodeSpec, "content" | "isolating" | "group" | "parseDOM" | "toDOM">;

export declare const colgroup: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const col: RequiredProps<NodeSpec, "tableRole" | "parseDOM" | "toDOM">;

export declare const thead: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const tbody: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const tfoot: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const caption: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const captionBlock: RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">;

export declare const tableRowComplex: RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">;

export declare const tableCellComplex: RequiredProps<
  NodeSpec,
  "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM"
>;

export declare const tableCellComplexBlock: RequiredProps<
  NodeSpec,
  "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM"
>;

export declare const tableHeaderComplex: RequiredProps<
  NodeSpec,
  "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM"
>;

export declare const tableHeaderComplexBlock: RequiredProps<
  NodeSpec,
  "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM"
>;
