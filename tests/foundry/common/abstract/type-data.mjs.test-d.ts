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

type BaseQuestData = { description?: string; steps: string[] };
type DerivedQuestData = { totalSteps: number };

// Test With specified Base and DerivedData.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel extends foundry.abstract.TypeDataModel<
  QuestSchema,
  BaseJournalEntryPage,
  BaseQuestData,
  DerivedQuestData
> {
  prepareBaseData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, BaseQuestData>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // @ts-expect-error Derived Data is not available yet
    this.totalSteps + 1;
  }

  prepareDerivedData(
    this: Merge<Merge<DataModel<QuestSchema, BaseJournalEntryPage>, BaseQuestData>, DerivedQuestData>,
  ): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // From DervivedData
    this.totalSteps + 1;
    // @ts-expect-error DerivedData should be declared
    this.reward + 1;
  }
}

/* Test with default BaseData and DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel2 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage> {
  prepareBaseData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, Record<string, never>>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // @ts-expect-error There is no BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error Derived Data is not available yet
    this.totalSteps + 1;
  }

  prepareDerivedData(
    this: Merge<Merge<DataModel<QuestSchema, BaseJournalEntryPage>, Record<string, never>>, Record<string, never>>,
  ): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // @ts-expect-error There is no BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error There is no DerivedData
    this.totalSteps + 1;
  }
}

/* Test with no DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel3 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage, BaseQuestData> {
  prepareBaseData(this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, BaseQuestData>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // @ts-expect-error There is no derived Data
    this.totalSteps + 1;
  }

  prepareDerivedData(
    this: Merge<Merge<DataModel<QuestSchema, BaseJournalEntryPage>, BaseQuestData>, Partial<Record<string, never>>>,
  ): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<string | undefined>;

    // @ts-expect-error There is no DerivedData
    this.totalSteps + 1;
  }
}
