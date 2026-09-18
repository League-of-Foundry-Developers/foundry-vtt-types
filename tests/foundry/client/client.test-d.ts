import { test } from "vitest";

test("foundry/client/client", () => {
  // @ts-expect-error The `types` file is not actually exported as an object into the foundry namespace
  foundry.types;
});
