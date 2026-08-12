import { expectTypeOf } from "vitest";
import type { Fragment, Mark, Node } from "prosemirror-model";

import type StringNode from "../../../../src/foundry/common/utils/string-node.mts";
import StringSerializer from "../../../../src/foundry/common/prosemirror/string-serializer.mts";

declare const schema: foundry.prosemirror.Schema;

expectTypeOf(StringSerializer.fromSchema(schema)).toEqualTypeOf<StringSerializer>();

declare const nodes: Record<string, StringSerializer.NodeOutput>;
declare const marks: Record<string, StringSerializer.MarkOutput>;

const stringSerializer = new StringSerializer(nodes, marks);

declare const el: HTMLElement;
expectTypeOf(stringSerializer["_specToStringNode"](["span", "some spec string"])).toEqualTypeOf<{
  outer: StringNode.Any;
  content?: StringNode.Any | undefined;
}>();
expectTypeOf(
  stringSerializer["_specToStringNode"]({ dom: el, contentDOM: el }, false),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(stringSerializer["_specToStringNode"](el, true)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(
  stringSerializer["_specToStringNode"](["some spec string", { foo: 7 }, 20], undefined),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();

declare const fragment: Fragment;
expectTypeOf(stringSerializer.serializeFragment(fragment)).toEqualTypeOf<StringNode>();

declare const target: StringNode.Any;
expectTypeOf(stringSerializer.serializeFragment(fragment, target)).toEqualTypeOf<StringNode.Any>();

declare const node: Node;
expectTypeOf(stringSerializer["_toStringNode"](node)).toEqualTypeOf<StringNode.Any>();

declare const mark: Mark;
expectTypeOf(stringSerializer["_serializeMark"](mark)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(stringSerializer["_serializeMark"](mark, false)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(
  stringSerializer["_serializeMark"](mark, undefined),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
