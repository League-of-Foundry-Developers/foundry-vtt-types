import { expectTypeOf } from "vitest";

import FilePicker = foundry.applications.apps.FilePicker;

const fileElement = new foundry.applications.elements.HTMLFilePickerElement();

expectTypeOf(fileElement.input).toEqualTypeOf<HTMLInputElement>();
expectTypeOf(fileElement.button).toEqualTypeOf<HTMLButtonElement>();
expectTypeOf(fileElement.picker).toEqualTypeOf<FilePicker>();
expectTypeOf(fileElement.type).toEqualTypeOf<FilePicker.Type>();
expectTypeOf(fileElement.noupload).toEqualTypeOf<boolean>();
expectTypeOf(fileElement.picker).toEqualTypeOf<FilePicker>();

expectTypeOf(foundry.applications.elements.HTMLFilePickerElement.tagName).toEqualTypeOf<"file-picker">();

declare const config: foundry.applications.elements.HTMLFilePickerElement.FilePickerInputConfig;
expectTypeOf(foundry.applications.elements.HTMLFilePickerElement.create(config)).toEqualTypeOf<HTMLElement>();
