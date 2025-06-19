import { expectTypeOf } from "vitest";
import { paragraph, blockquote, hr, heading, pre, br } from "#common/prosemirror/schema/core.mjs";
import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(paragraph).toEqualTypeOf<
  RequiredProps<NodeSpec, "attrs" | "managed" | "content" | "group" | "parseDOM" | "toDOM">
>();

expectTypeOf(blockquote).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">
>();

expectTypeOf(hr).toEqualTypeOf<RequiredProps<NodeSpec, "group" | "parseDOM" | "toDOM">>();

expectTypeOf(heading).toEqualTypeOf<
  RequiredProps<NodeSpec, "attrs" | "content" | "group" | "defining" | "parseDOM" | "toDOM">
>();

expectTypeOf(pre).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "marks" | "group" | "code" | "defining" | "parseDOM" | "toDOM">
>();

expectTypeOf(br).toEqualTypeOf<RequiredProps<NodeSpec, "inline" | "group" | "selectable" | "parseDOM" | "toDOM">>();
