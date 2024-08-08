import { Node } from "prosemirror-model";

export declare const paragraph: {
  attrs: Record<string, unknown>;
  managed: Record<string, unknown>;
  content: string;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: (node: Node) => [string, Record<string, string>, number] | [string, number];
};

export declare const blockquote: {
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
};

export declare const hr: {
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
};

export declare const heading: {
  attrs: Record<string, unknown>;
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: (node: Node) => [string, number];
};

export declare const pre: {
  content: string;
  marks: string;
  group: string;
  code: boolean;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, [string, number]];
};

export declare const br: {
  inline: boolean;
  group: string;
  selectable: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
};
