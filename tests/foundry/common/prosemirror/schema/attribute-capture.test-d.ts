import type { MarkSpec, NodeSpec } from "prosemirror-model";
import { expectTypeOf, test } from "vitest";
import AttributeCapture from "../../../../../src/foundry/common/prosemirror/schema/attribute-capture.mts";

declare const nodeSpec: NodeSpec;
declare const markSpec: MarkSpec;

declare const element: HTMLElement;

test("foundry/common/prosemirror/schema/attribute-capture", () => {
  const attributeCapture = new AttributeCapture();
  expectTypeOf(attributeCapture.attributeCapture(nodeSpec)).toEqualTypeOf<void>();
  expectTypeOf(attributeCapture.attributeCapture(markSpec)).toEqualTypeOf<void>();
  expectTypeOf(attributeCapture._captureAttributes(element)).toEqualTypeOf<Record<string, string>>();
  expectTypeOf(attributeCapture._captureClasses(element, { classes: ["managed"] })).toEqualTypeOf<string>();
});
