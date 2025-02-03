/* eslint-disable import/extensions */
import type { DOMOutputSpec, MarkSpec, NodeSpec } from "prosemirror-model";
import { expectTypeOf } from "vitest";
import AttributeCapture from "../../../../../src/foundry/common/prosemirror/schema/attribute-capture.mjs";

const attributeCapture = new AttributeCapture();
declare const nodeSpec: NodeSpec;
declare const markSpec: MarkSpec;
expectTypeOf(attributeCapture.attributeCapture(nodeSpec)).toEqualTypeOf<DOMOutputSpec>();
expectTypeOf(attributeCapture.attributeCapture(markSpec)).toEqualTypeOf<DOMOutputSpec>();
