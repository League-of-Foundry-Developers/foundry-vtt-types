import { expectTypeOf } from "vitest";
import type { fields } from "../../../../src/foundry/common/data/module.d.mts";
import type BaseJournalEntryPage from "../../../../src/foundry/common/documents/journal-entry-page.d.mts";
import type { TypeDataModel } from "../../../../src/foundry/common/abstract/type-data.d.mts";

/* attempting to use the example as a test */

interface QuestSchema extends BaseJournalEntryPage.Schema {
  description: fields.HTMLField<{ required: false; blank: true; initial: "" }>;
  steps: fields.ArrayField<fields.StringField<{ required: true }>>;
}

type BaseQuestData = {
  // Overrides the schema
  description: HTMLElement;
  questName: string;
};
type DerivedQuestData = { totalSteps: number };

// Test With specified Base and DerivedData.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel extends foundry.abstract.TypeDataModel<
  QuestSchema,
  BaseJournalEntryPage,
  BaseQuestData,
  DerivedQuestData
> {
  otherMethod() {}

  prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    this.otherMethod();

    // From schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement | undefined>;

    // @ts-expect-error Derived Data is not available yet
    this.totalSteps + 1;

    // @ts-expect-error Recursively calling is technically possible but wouldn't be desired. Removing it also seems to reduce the type complexity.
    this.prepareBaseData();

    // @ts-expect-error The this parameter is incompatible.
    this.prepareDerivedData();
  }

  prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    this.otherMethod();

    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From QuestSchema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // From BaseData
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement>;

    expectTypeOf(this.totalSteps).toEqualTypeOf<number | undefined>();

    // @ts-expect-error this key was declared nowhere.
    this.afsdasdfqeqw + 1;

    // @ts-expect-error The this parameter is incompatible.
    this.prepareBaseData();

    // @ts-expect-error Recursively calling is technically possible but wouldn't be desired. Removing it also seems to reduce the type complexity.
    this.prepareDerivedData();
  }
}

/* Test with default BaseData and DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel2 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage> {
  prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // Comes from the schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error there is no base data this time.
    this.questName;

    // @ts-expect-error there is no derived data this time.
    this.totalSteps + 1;
  }

  prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // Comes from the schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error there is no base data this time.
    this.questName;

    // @ts-expect-error there is no derived data this time.
    this.totalSteps + 1;
  }
}

/* Test with no DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel3 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage, BaseQuestData> {
  prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement | undefined>;

    // @ts-expect-error There is no derived Data
    this.totalSteps + 1;
  }

  prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<Record<string, unknown>>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement>;

    // @ts-expect-error There is no DerivedData
    this.totalSteps + 1;
  }
}
