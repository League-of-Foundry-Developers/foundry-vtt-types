import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BaseJournalEntryPage();
// @ts-expect-error name is a required field
new foundry.documents.BaseJournalEntryPage({});

const myJournalEntryPage = new foundry.documents.BaseJournalEntryPage({ name: "foo" });

expectTypeOf(myJournalEntryPage.type).toEqualTypeOf<"image" | "pdf" | "text" | "video">();

// TODO: DataModelConfig
