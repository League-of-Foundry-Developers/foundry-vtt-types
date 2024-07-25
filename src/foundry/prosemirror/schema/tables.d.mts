import { Node } from "prosemirror-model";

export declare const builtInTableNodes: {
  table: Record<string, unknown>;
  table_cell: Record<string, unknown>;
  table_header: Record<string, unknown>;
  table_row: Record<string, unknown>;
};

export declare const tableComplex: {
  content: string;
  isolating: boolean;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const colgroup: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const col: {
  tableRole: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
};

export declare const thead: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const tbody: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const tfoot: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const caption: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const captionBlock: {
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const tableRowComplex: {
  content: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const tableCellComplex: {
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
};

export declare const tableCellComplexBlock: {
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
};

export declare const tableHeaderComplex: {
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
};

export declare const tableHeaderComplexBlock: {
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
};
