import { expectTypeOf } from "vitest";

import FilePicker = foundry.applications.apps.FilePicker;

declare const sourceType: FilePicker.SourceType;

expectTypeOf(sourceType).toEqualTypeOf<"data" | "public" | "s3">();

declare const myFile: File;

const response = await FilePicker.upload("foo", "bar", myFile);

expectTypeOf(response.ok).toBeBoolean();

const myPicker = new FilePicker();

myPicker.render(true);
myPicker.render({ force: true });
