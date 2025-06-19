import { expectTypeOf } from "vitest";
import { ol, ul, li, liText } from "#common/prosemirror/schema/lists.mjs";
import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(ol).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "managed" | "group" | "attrs" | "parseDOM" | "toDOM">
>();

expectTypeOf(ul).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">>();

expectTypeOf(li).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(liText).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();
