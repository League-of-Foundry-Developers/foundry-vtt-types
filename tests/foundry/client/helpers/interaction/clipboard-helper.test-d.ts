import { expectTypeOf } from "vitest";

import ClipboardHelper = foundry.helpers.interaction.ClipboardHelper;

const clipboardHelper = new ClipboardHelper();

expectTypeOf(clipboardHelper.copyPlainText("some text")).toEqualTypeOf<Promise<void>>();
