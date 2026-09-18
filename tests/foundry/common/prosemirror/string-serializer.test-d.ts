import { expectTypeOf, test } from "vitest";
import type { Fragment, Mark, Node } from "prosemirror-model";

import type StringNode from "../../../../src/foundry/common/utils/string-node.mts";
import StringSerializer from "../../../../src/foundry/common/prosemirror/string-serializer.mts";

declare const schema: foundry.prosemirror.Schema;

declare const nodes: Record<string, StringSerializer.NodeOutput>;
declare const marks: Record<string, StringSerializer.MarkOutput>;

declare const el: HTMLElement;

declare const fragment: Fragment;

declare const target: StringNode.Any;

declare const tagged: StringNode<"div">;

declare const maybeTarget: StringNode<"div"> | undefined;

declare const node: Node;

declare const mark: Mark;

test("foundry/common/prosemirror/string-serializer", () => {
  expectTypeOf(StringSerializer.fromSchema(schema)).toEqualTypeOf<StringSerializer>();

  const stringSerializer = new StringSerializer(nodes, marks);
  expectTypeOf(stringSerializer["_specToStringNode"](["span", "some spec string"])).toEqualTypeOf<{
    outer: StringNode.Any;
    content?: StringNode.Any | undefined;
  }>();
  expectTypeOf(
    stringSerializer["_specToStringNode"]({ dom: el, contentDOM: el }, false),
  ).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
  expectTypeOf(
    stringSerializer["_specToStringNode"](el, true),
  ).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
  expectTypeOf(
    stringSerializer["_specToStringNode"](["some spec string", { foo: 7 }, 20], undefined),
  ).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
  expectTypeOf(stringSerializer.serializeFragment(fragment)).toEqualTypeOf<StringNode>();
  expectTypeOf(stringSerializer.serializeFragment(fragment, target)).toEqualTypeOf<StringNode.Any>();
  expectTypeOf(stringSerializer.serializeFragment(fragment, tagged)).toEqualTypeOf<StringNode<"div">>();
  expectTypeOf(stringSerializer.serializeFragment(fragment, maybeTarget)).toExtend<StringNode.Any>();
  expectTypeOf(stringSerializer["_toStringNode"](node)).toEqualTypeOf<StringNode.Any>();
  expectTypeOf(stringSerializer["_serializeMark"](mark)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
  expectTypeOf(
    stringSerializer["_serializeMark"](mark, false),
  ).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
  expectTypeOf(
    stringSerializer["_serializeMark"](mark, undefined),
  ).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
});
