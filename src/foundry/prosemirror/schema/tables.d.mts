import { Node } from "prosemirror-model";

export declare const builtInTableNodes: Record<any, any>;

export declare const tableComplex: {
  content: string;
  isolating: boolean;
  group: string;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const colgroup: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const col: {
  tableRole: string;
  parseDOM: Record<any, any>[];
  toDOM: () => [string];
};

export declare const thead: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const tbody: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const tfoot: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const caption: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const captionBlock: {
  content: string;
  isolating: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const tableRowComplex: {
  content: string;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const tableCellComplex: {
  content: string;
  attrs: Record<string, any>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<any, any>;
  toDOM: (node: Node) => [string, any, number];
};

export declare const tableCellComplexBlock: {
  content: string;
  attrs: Record<string, any>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<any, any>;
  toDOM: (node: Node) => [string, any, number];
};

export declare const tableHeaderComplex: {
  content: string;
  attrs: Record<string, any>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<any, any>;
  toDOM: (node: Node) => [string, any, number];
};

export declare const tableHeaderComplexBlock: {
  content: string;
  attrs: Record<string, any>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<any, any>;
  toDOM: (node: Node) => [string, any, number];
};
