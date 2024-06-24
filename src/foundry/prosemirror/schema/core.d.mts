import { Node } from "prosemirror-model";

export declare const paragraph: {
  attrs: Record<string, any>;
  managed: Record<any, any>;
  content: string;
  group: string;
  parseDOM: Record<any, any>[];
  toDOM: (node: Node) => [string, Record<string, string>, number] | [string, number];
};

export declare const blockquote: {
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, number];
};

export declare const hr: {
  group: string;
  parseDOM: Record<any, any>[];
  toDOM: () => [string];
};

export declare const heading: {
  attrs: Record<string, any>;
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<any, any>[];
  toDOM: (node: Node) => [string, number];
};

export declare const pre: {
  content: string;
  marks: string;
  group: string;
  code: boolean;
  defining: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string, [string, number]];
};

export declare const br: {
  inline: boolean;
  group: string;
  selectable: boolean;
  parseDOM: Record<any, any>[];
  toDOM: () => [string];
};
