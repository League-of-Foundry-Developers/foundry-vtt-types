import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BaseJournalEntryPage();
// @ts-expect-error name is a required field
new foundry.documents.BaseJournalEntryPage({});

const myJournalEntryPage = new foundry.documents.BaseJournalEntryPage({ name: "foo" });

// Testing Core types

declare const coreTypeMetadata: foundry.documents.BaseJournalEntryPage.Metadata["coreTypes"][number];
declare const coreTypes: (typeof foundry.documents.BaseJournalEntryPage)["metadata"]["coreTypes"][number];
declare const JEPTypes: foundry.documents.BaseJournalEntryPage.TypeNames;

expectTypeOf(coreTypeMetadata).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(coreTypes).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(JEPTypes).toEqualTypeOf<"base" | "image" | "pdf" | "text" | "video">();
// headquarters is added in tests/foundry/common/data/fields.test-d.ts
expectTypeOf(myJournalEntryPage.type).toEqualTypeOf<"base" | "image" | "pdf" | "text" | "video" | "headquarters">();
