import { expectTypeOf } from "vitest";

const tagsElement = new foundry.applications.elements.HTMLDocumentTagsElement();

expectTypeOf(tagsElement.type).toEqualTypeOf<string | null>();
expectTypeOf(tagsElement.single).toEqualTypeOf<boolean>();
expectTypeOf(tagsElement.max).toEqualTypeOf<number>();

declare const doc: Actor.Implementation;
expectTypeOf(tagsElement._validateDocument(doc)).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.elements.HTMLDocumentTagsElement.tagName).toEqualTypeOf<"document-tags">();
expectTypeOf(foundry.applications.elements.HTMLDocumentTagsElement.renderTag("", "")).toEqualTypeOf<HTMLDivElement>();

declare const config: foundry.applications.elements.HTMLDocumentTagsElement.DocumentTagsInputConfig;
expectTypeOf(
  foundry.applications.elements.HTMLDocumentTagsElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLDocumentTagsElement>();
