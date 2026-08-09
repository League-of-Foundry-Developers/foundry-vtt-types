import { expectTypeOf } from "vitest";

import HTMLGridOffset2DTagsElement = foundry.applications.elements.HTMLGridOffset2DTagsElement;
import HTMLGridOffset3DTagsElement = foundry.applications.elements.HTMLGridOffset3DTagsElement;

expectTypeOf(HTMLGridOffset2DTagsElement.tagName).toBeString();
expectTypeOf(
  HTMLGridOffset2DTagsElement.icons,
).toEqualTypeOf<foundry.applications.elements.HTMLStringTagsElement.Icons>();
expectTypeOf(
  HTMLGridOffset2DTagsElement.labels,
).toEqualTypeOf<foundry.applications.elements.HTMLStringTagsElement.Labels>();

expectTypeOf(HTMLGridOffset3DTagsElement.tagName).toBeString();
expectTypeOf(
  HTMLGridOffset3DTagsElement.icons,
).toEqualTypeOf<foundry.applications.elements.HTMLStringTagsElement.Icons>();
expectTypeOf(
  HTMLGridOffset3DTagsElement.labels,
).toEqualTypeOf<foundry.applications.elements.HTMLStringTagsElement.Labels>();

declare class _Test2DSubclass extends HTMLGridOffset2DTagsElement {
  protected override _validateTag(tag: string): void;
}

declare class _Test3DSubclass extends HTMLGridOffset3DTagsElement {
  protected override _validateTag(tag: string): void;
}
