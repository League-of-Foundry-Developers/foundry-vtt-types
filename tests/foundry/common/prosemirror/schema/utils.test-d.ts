/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import {
  onlyInlineContent,
  isElementEmpty,
  stylesFromString,
  mergeStyle,
  classesFromString,
  mergeClass,
} from "../../../../../src/foundry/common/prosemirror/schema/utils.mjs";

declare const el: HTMLElement;
expectTypeOf(onlyInlineContent(el)).toEqualTypeOf<boolean>();
expectTypeOf(isElementEmpty(el)).toEqualTypeOf<boolean>();
expectTypeOf(stylesFromString("")).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(mergeStyle("", "")).toEqualTypeOf<string>();
expectTypeOf(classesFromString("")).toEqualTypeOf<string[]>();
expectTypeOf(mergeClass("", "")).toEqualTypeOf<string>();
