import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
import {
  onlyInlineContent,
  isElementEmpty,
  stylesFromString,
  mergeStyle,
  classesFromString,
  mergeClass,
} from "../../../../../src/foundry/common/prosemirror/schema/utils.mts";

declare const el: HTMLElement;
expectTypeOf(onlyInlineContent(el)).toEqualTypeOf<boolean>();
expectTypeOf(isElementEmpty(el)).toEqualTypeOf<boolean>();
expectTypeOf(stylesFromString("")).toEqualTypeOf<Record<string, string>>();
expectTypeOf(mergeStyle("", "")).toEqualTypeOf<string>();
expectTypeOf(classesFromString("")).toEqualTypeOf<string[]>();
expectTypeOf(mergeClass("", "")).toEqualTypeOf<string>();
