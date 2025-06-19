import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

export declare const paragraph: RequiredProps<
  NodeSpec,
  "attrs" | "managed" | "content" | "group" | "parseDOM" | "toDOM"
>;

export declare const blockquote: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const hr: RequiredProps<NodeSpec, "group" | "parseDOM" | "toDOM">;

export declare const heading: RequiredProps<
  NodeSpec,
  "attrs" | "content" | "group" | "defining" | "parseDOM" | "toDOM"
>;

export declare const pre: RequiredProps<
  NodeSpec,
  "content" | "marks" | "group" | "code" | "defining" | "parseDOM" | "toDOM"
>;

export declare const br: RequiredProps<NodeSpec, "inline" | "group" | "selectable" | "parseDOM" | "toDOM">;
