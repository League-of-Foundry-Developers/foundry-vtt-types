import { expectTypeOf } from "vitest";
import type { Fragment, Mark } from "prosemirror-model";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports, import-x/extensions
import StringSerializer, { StringNode } from "../../../../src/foundry/common/prosemirror/string-serializer.mjs";

declare const schema: foundry.prosemirror.Schema;

expectTypeOf(StringSerializer.fromSchema(schema)).toEqualTypeOf<StringSerializer>();

declare const nodes: Record<string, StringSerializer.NodeOutput>;
declare const marks: Record<string, StringSerializer.MarkOutput>;

const stringSerializer = new StringSerializer(nodes, marks);

declare const node: globalThis.Node;
declare const el: HTMLElement;
expectTypeOf(stringSerializer["_specToStringNode"]("some spec string")).toEqualTypeOf<{
  outer: StringNode;
  content?: StringNode;
}>();
expectTypeOf(
  stringSerializer["_specToStringNode"]({ dom: node, contentDOM: el }, false),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(
  stringSerializer["_specToStringNode"](node, true),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(
  stringSerializer["_specToStringNode"](["some spec string", { foo: 7 }, 20], undefined),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();

declare const fragment: Fragment;
expectTypeOf(stringSerializer.serializeFragment(fragment)).toEqualTypeOf<StringNode>();

expectTypeOf(stringSerializer["_toStringNode"](node)).toEqualTypeOf<StringNode>();

declare const mark: Mark;
expectTypeOf(stringSerializer["_serializeMark"](mark)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(stringSerializer["_serializeMark"](mark, false)).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();
expectTypeOf(
  stringSerializer["_serializeMark"](mark, undefined),
).toEqualTypeOf<StringSerializer.SpecToStringNodeReturn>();

new StringNode();
new StringNode("div");
new StringNode("section", { style: "color:red;" });
new StringNode("a", { href: "http://example.com" }, true);
const stringNode = new StringNode(undefined, undefined, undefined);

expectTypeOf(stringNode.tag).toEqualTypeOf<Readonly<string | undefined>>();
expectTypeOf(stringNode.attrs).toEqualTypeOf<Record<string, string> | undefined>();
expectTypeOf(stringNode.inline).toEqualTypeOf<boolean>();

expectTypeOf(stringNode.appendChild(stringNode)).toEqualTypeOf<void>();
expectTypeOf(stringNode.appendChild("<p>some html string</p>")).toEqualTypeOf<void>();

expectTypeOf(stringNode.toString()).toEqualTypeOf<string>();
expectTypeOf(stringNode.toString(7)).toEqualTypeOf<string>();
expectTypeOf(stringNode.toString("#########")).toEqualTypeOf<string>();
// spaces over `10` or more than 10 characters long for strings get clamped
expectTypeOf(stringNode.toString(11, {})).toEqualTypeOf<string>();
// both properties of options are for internal recursive use and aren't designed to be passed
expectTypeOf(stringNode.toString(11, { _depth: 0, _inlineParent: false })).toEqualTypeOf<string>();
