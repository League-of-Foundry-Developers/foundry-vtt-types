import { expectTypeOf } from "vitest";
import type DataModel from "../../../../src/foundry/common/abstract/data.d.mts";
import type { fields } from "../../../../src/foundry/common/data/module.d.mts";
import type { Merge } from "../../../../src/types/utils.d.mts";
import type BaseJournalEntryPage from "../../../../src/foundry/common/documents/journal-entry-page.d.mts";

/* attempting to use the example as a test */

interface QuestSchema extends BaseJournalEntryPage.Schema {
  description: fields.HTMLField<{ required: false; blank: true; initial: "" }>;
  steps: fields.ArrayField<fields.StringField>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage, { totalSteps: number }> {
  prepareBaseData(this: DataModel<QuestSchema, BaseJournalEntryPage>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From Quest
    expectTypeOf(this.steps).toEqualTypeOf<string[] | undefined[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // @ts-expect-error Derived Data is not available yet
    this.totalSteps + 1;
  }

  prepareDerivedData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, { totalSteps?: number }>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From Quest
    expectTypeOf(this.steps).toEqualTypeOf<string[] | undefined[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // Derived from Quest
    if (this.totalSteps) this.totalSteps + 1;
  }
}

/* Test with no DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel2 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage> {
  prepareDerivedData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, {}>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From Quest
    expectTypeOf(this.steps).toEqualTypeOf<string[] | undefined[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // @ts-expect-error Derived data should be declared
    this.reward + 1;
  }
}

/* Test with no DerivedData, with the user screwing up */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel3 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage> {
  // FIXME: Here the user can force the derived data.
  prepareDerivedData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, { reward: number }>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From Quest
    expectTypeOf(this.steps).toEqualTypeOf<string[] | undefined[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // No error when there should be one.
    this.reward + 1;
  }
}
