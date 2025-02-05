import { expectTypeOf } from "vitest";
import type { DOMParser as BaseDOMParser, Node } from "prosemirror-model";
import type { FixedInstanceType } from "../../../../src/utils/index.d.mts";

declare const schema: foundry.prosemirror.Schema;

declare const domParser: foundry.prosemirror.DOMParser;
declare const dom: FixedInstanceType<typeof window.Node>;
expectTypeOf(domParser.parse(dom, {})).toEqualTypeOf<Node>();

expectTypeOf(foundry.prosemirror.DOMParser.fromSchema(schema)).toEqualTypeOf<BaseDOMParser>();
