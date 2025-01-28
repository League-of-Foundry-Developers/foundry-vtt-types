import { expectTypeOf } from "vitest";

const stringTags = new foundry.applications.elements.HTMLStringTagsElement();

expectTypeOf(stringTags._value).toEqualTypeOf<Set<string>>();

expectTypeOf(foundry.applications.elements.HTMLStringTagsElement.tagName).toEqualTypeOf<"string-tags">();

expectTypeOf(foundry.applications.elements.HTMLStringTagsElement.icons).toEqualTypeOf<{
  add: string;
  remove: string;
}>();
expectTypeOf(foundry.applications.elements.HTMLStringTagsElement.labels).toEqualTypeOf<{
  add: string;
  remove: string;
  placeholder: string;
}>();
expectTypeOf(foundry.applications.elements.HTMLStringTagsElement.renderTag("")).toEqualTypeOf<HTMLDivElement>();

declare const config: foundry.applications.elements.HTMLStringTagsElement.StringTagsInputConfig;
expectTypeOf(
  foundry.applications.elements.HTMLStringTagsElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLStringTagsElement>();
