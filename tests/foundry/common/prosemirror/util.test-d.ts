import { expectTypeOf, test } from "vitest";
import type { Fragment, Node, Slice } from "prosemirror-model";

import {
  parseHTMLString,
  serializeHTMLString,
  transformSlice,
} from "../../../../src/foundry/common/prosemirror/util.mts";

declare const node: Node;

declare const fragment: Fragment;

declare const slice: Slice;
declare const transformer: transformSlice.SliceTransformer;

test("foundry/common/prosemirror/util", () => {
  expectTypeOf(parseHTMLString("")).toEqualTypeOf<Node>();

  expectTypeOf(serializeHTMLString(node)).toEqualTypeOf<string>();
  expectTypeOf(serializeHTMLString(node, {})).toEqualTypeOf<string>();
  expectTypeOf(
    serializeHTMLString(node, { schema: foundry.prosemirror.defaultSchema, spaces: 7 }),
  ).toEqualTypeOf<string>();
  expectTypeOf(serializeHTMLString(node, { schema: undefined, spaces: undefined })).toEqualTypeOf<string>();
  expectTypeOf(serializeHTMLString(fragment)).toEqualTypeOf<string>();
  expectTypeOf(transformSlice(slice, transformer)).toEqualTypeOf<Slice>();
});
