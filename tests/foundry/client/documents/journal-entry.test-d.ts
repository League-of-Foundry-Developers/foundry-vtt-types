import { expectTypeOf, test } from "vitest";

test("foundry/client/documents/journal-entry", () => {
  // @ts-expect-error data is required
  new JournalEntry.implementation();

  // @ts-expect-error name is required
  new JournalEntry.implementation({});

  const myJournalEntry = new JournalEntry.implementation({ name: "foo" });

  expectTypeOf(myJournalEntry._temporaryObserver).toEqualTypeOf<boolean>();
});
