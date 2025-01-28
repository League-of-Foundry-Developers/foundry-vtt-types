import { expectTypeOf } from "vitest";

const clipboardHelper = new ClipboardHelper();

expectTypeOf(clipboardHelper.copyPlainText("")).toEqualTypeOf<Promise<void>>();
