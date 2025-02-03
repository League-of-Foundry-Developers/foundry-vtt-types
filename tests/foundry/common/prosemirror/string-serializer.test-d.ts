/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import StringSerializer, { StringNode } from "../../../../src/foundry/common/prosemirror/string-serializer.mjs";
import type {
  ProseMirrorMarkOutput,
  ProseMirrorNodeOutput,
} from "../../../../src/foundry/common/prosemirror/string-serializer.mjs";
import type { Fragment } from "prosemirror-model";

declare const schema: foundry.prosemirror.Schema;

declare const nodes: Record<string, ProseMirrorNodeOutput>;
declare const marks: Record<string, ProseMirrorMarkOutput>;

const stringSerializer = new StringSerializer(nodes, marks);

declare const fragment: Fragment;
expectTypeOf(stringSerializer.serializeFragment(fragment)).toEqualTypeOf<StringNode>();

expectTypeOf(StringSerializer.fromSchema(schema)).toEqualTypeOf<StringSerializer>();

const stringNode = new StringNode();
expectTypeOf(stringNode.tag).toEqualTypeOf<Readonly<string | undefined>>();
expectTypeOf(stringNode.attrs).toEqualTypeOf<Record<string, string> | undefined>();
expectTypeOf(stringNode.inline).toEqualTypeOf<boolean>();
expectTypeOf(stringNode.appendChild(stringNode)).toEqualTypeOf<void>();
expectTypeOf(stringNode.toString()).toEqualTypeOf<string>();
