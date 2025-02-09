/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import {
  parseHTMLString,
  serializeHTMLString,
  transformSlice,
} from "../../../../src/foundry/common/prosemirror/util.mjs";
import type { ProseMirrorSliceTransformer } from "../../../../src/foundry/common/prosemirror/util.d.mts";
import type { Node, Slice } from "prosemirror-model";

declare const node: Node;

expectTypeOf(parseHTMLString("")).toEqualTypeOf<Node>();
expectTypeOf(serializeHTMLString(node)).toEqualTypeOf<string>();

declare const slice: Slice;
declare const transformer: ProseMirrorSliceTransformer;
expectTypeOf(transformSlice(slice, transformer)).toEqualTypeOf<Slice>();
