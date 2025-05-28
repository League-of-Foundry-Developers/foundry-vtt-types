import { expectTypeOf } from "vitest";

const proseMirror = new foundry.applications.elements.HTMLProseMirrorElement();

expectTypeOf(proseMirror.disconnectedCallback()).toEqualTypeOf<void>();
expectTypeOf(proseMirror._buildElements()).toEqualTypeOf<(HTMLButtonElement | HTMLDivElement)[]>();
expectTypeOf(proseMirror._getValue()).toEqualTypeOf<string>();
expectTypeOf(proseMirror._toggleDisabled(true)).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.elements.HTMLProseMirrorElement.tagName).toEqualTypeOf<"prose-mirror">();

declare const config: foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig;
expectTypeOf(
  foundry.applications.elements.HTMLProseMirrorElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLProseMirrorElement>();
