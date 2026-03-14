import { expectTypeOf } from "vitest";

import Document = foundry.abstract.Document;
import BaseJournalEntryPage = foundry.documents.BaseJournalEntryPage;

// This exists to make the class non-abstract.
class TestBaseJournalEntryPage extends foundry.documents.BaseJournalEntryPage {
  get compendium(): foundry.documents.collections.CompendiumCollection.ForDocument<"JournalEntryPage"> | null {
    const pack = this.inCompendium ? (game.packs!.get(this.pack ?? "") ?? null) : null;
    if (!pack) return null;
    return pack as foundry.documents.collections.CompendiumCollection.ForDocument<"JournalEntryPage">;
  }
}

// @ts-expect-error name is a required field
new TestBaseJournalEntryPage();

// @ts-expect-error name is a required field
new TestBaseJournalEntryPage({});

const myJournalEntryPage = new TestBaseJournalEntryPage({ name: "foo" });

// Testing Core types

declare const coreTypeMetadata: BaseJournalEntryPage.Metadata["coreTypes"][number];
declare const coreTypes: (typeof BaseJournalEntryPage.metadata.coreTypes)[number];

expectTypeOf(coreTypeMetadata).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(coreTypes).toEqualTypeOf<"image" | "pdf" | "text" | "video">();

// headquarters is added in tests/foundry/common/data/fields.test-d.ts
type SubType = "image" | "pdf" | "text" | "video" | "headquarters" | Document.ModuleSubType;

expectTypeOf<BaseJournalEntryPage.SubType>().toEqualTypeOf<SubType>();
expectTypeOf(myJournalEntryPage.type).toEqualTypeOf<SubType>();
