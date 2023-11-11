import { expectTypeOf } from "vitest";

// @ts-expect-error - A JournalEntryData requires data.
new foundry.data.JournalEntryData();

// @ts-expect-error - A JournalEntryData requires a name.
new foundry.data.JournalEntryData({});

expectTypeOf(new foundry.data.JournalEntryData({ name: "foo" })).toEqualTypeOf<foundry.data.JournalEntryData>();
