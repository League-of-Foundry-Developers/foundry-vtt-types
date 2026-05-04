import { expectTypeOf } from "vitest";
import type { Node, Slice } from "prosemirror-model";

import {
  parseHTMLString,
  serializeHTMLString,
  transformSlice,
} from "../../../../src/foundry/common/prosemirror/util.mts";

declare const node: Node;

expectTypeOf(parseHTMLString("")).toEqualTypeOf<Node>();

expectTypeOf(serializeHTMLString(node)).toEqualTypeOf<string>();
expectTypeOf(serializeHTMLString(node, {})).toEqualTypeOf<string>();
expectTypeOf(
  serializeHTMLString(node, { schema: foundry.prosemirror.defaultSchema, spaces: 7 }),
).toEqualTypeOf<string>();
expectTypeOf(serializeHTMLString(node, { schema: undefined, spaces: undefined })).toEqualTypeOf<string>();

declare const slice: Slice;
declare const transformer: transformSlice.SliceTransformer;
expectTypeOf(transformSlice(slice, transformer)).toEqualTypeOf<Slice>();
