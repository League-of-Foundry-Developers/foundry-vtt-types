/* eslint-disable import/extensions */
import { expectTypeOf } from "vitest";
import ProseMirrorDropDown from "../../../../src/foundry/common/prosemirror/dropdown.mjs";

const proseMirrorDropDown = new ProseMirrorDropDown("", [], {});

declare const html: HTMLMenuElement;

expectTypeOf(proseMirrorDropDown.activateListeners(html)).toEqualTypeOf<void>();
expectTypeOf(proseMirrorDropDown.render()).toEqualTypeOf<string>();
expectTypeOf(proseMirrorDropDown.forEachItem(() => true)).toEqualTypeOf<void>();
