import { expectTypeOf } from "vitest";

import ClipboardHelper = foundry.helpers.interaction.ClipboardHelper;

const clipboardHelper = new ClipboardHelper();

expectTypeOf(clipboardHelper.copyPlainText("")).toEqualTypeOf<Promise<void>>();
