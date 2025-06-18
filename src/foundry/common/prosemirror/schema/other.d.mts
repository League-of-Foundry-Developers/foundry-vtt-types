import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

export declare const details: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const summary: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const summaryBlock: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const dl: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const dt: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const dd: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const fieldset: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const legend: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const picture: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const audio: RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">;

export declare const video: RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">;

export declare const track: RequiredProps<NodeSpec, "parseDOM" | "toDOM">;

export declare const source: RequiredProps<NodeSpec, "parseDOM" | "toDOM">;

export declare const object: RequiredProps<NodeSpec, "inline" | "group" | "parseDOM" | "toDOM">;

export declare const figure: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const figcaption: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const small: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const ruby: RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">;

export declare const rp: RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">;

export declare const rt: RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">;

export declare const iframe: RequiredProps<NodeSpec, "attrs" | "managed" | "group" | "defining" | "parseDOM" | "toDOM">;
