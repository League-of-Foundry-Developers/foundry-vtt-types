import { expectTypeOf, test } from "vitest";

import ClipboardHelper = foundry.helpers.interaction.ClipboardHelper;

test("foundry/client/helpers/interaction/clipboard-helper", () => {
  const clipboardHelper = new ClipboardHelper();

  expectTypeOf(clipboardHelper.copyPlainText("some text")).toEqualTypeOf<Promise<void>>();
});
