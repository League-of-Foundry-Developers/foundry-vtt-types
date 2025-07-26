import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import {
  onlyInlineContent,
  isElementEmpty,
  stylesFromString,
  mergeStyle,
  classesFromString,
  mergeClass,
  // eslint-disable-next-line import-x/extensions
} from "../../../../../src/foundry/common/prosemirror/schema/utils.mjs";

declare const el: HTMLElement;
expectTypeOf(onlyInlineContent(el)).toEqualTypeOf<boolean>();
expectTypeOf(isElementEmpty(el)).toEqualTypeOf<boolean>();
expectTypeOf(stylesFromString("")).toEqualTypeOf<Record<string, string>>();
expectTypeOf(mergeStyle("", "")).toEqualTypeOf<string>();
expectTypeOf(classesFromString("")).toEqualTypeOf<string[]>();
expectTypeOf(mergeClass("", "")).toEqualTypeOf<string>();
