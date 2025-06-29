import { expectTypeOf } from "vitest";
import type { DOMParser as BaseDOMParser, Node, ParseOptions } from "prosemirror-model";
import type { FixedInstanceType } from "fvtt-types/utils";

import DOMParser = foundry.prosemirror.DOMParser;

declare const schema: foundry.prosemirror.Schema;

declare const domParser: DOMParser;
declare const dom: FixedInstanceType<typeof window.Node>;
declare const parseOptions: ParseOptions;
expectTypeOf(domParser.parse(dom)).toEqualTypeOf<Node>();
expectTypeOf(domParser.parse(dom, parseOptions)).toEqualTypeOf<Node>();

expectTypeOf(foundry.prosemirror.DOMParser.fromSchema(schema)).toEqualTypeOf<BaseDOMParser>();
