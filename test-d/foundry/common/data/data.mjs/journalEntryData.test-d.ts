import { expectError, expectType } from "tsd";

expectError(new foundry.data.JournalEntryData());
expectError(new foundry.data.JournalEntryData({}));
expectType<foundry.data.JournalEntryData>(new foundry.data.JournalEntryData({ name: "foo" }));
