import type { MarkSpec, NodeSpec } from "prosemirror-model";
import { expectTypeOf } from "vitest";
import AttributeCapture from "../../../../../src/foundry/common/prosemirror/schema/attribute-capture.mts";

const attributeCapture = new AttributeCapture();
declare const nodeSpec: NodeSpec;
declare const markSpec: MarkSpec;
expectTypeOf(attributeCapture.attributeCapture(nodeSpec)).toEqualTypeOf<void>();
expectTypeOf(attributeCapture.attributeCapture(markSpec)).toEqualTypeOf<void>();

declare const element: HTMLElement;
expectTypeOf(attributeCapture._captureAttributes(element)).toEqualTypeOf<Record<string, string>>();
expectTypeOf(attributeCapture._captureClasses(element, { classes: ["managed"] })).toEqualTypeOf<string>();
