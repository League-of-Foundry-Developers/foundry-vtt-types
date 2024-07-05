import { expectTypeOf } from "vitest";
import type DataModel from "../../../../src/foundry/common/abstract/data.d.mts";
import type TypeDataModel from "../../../../src/foundry/common/abstract/type-data.d.mts";
import type { fields } from "../../../../src/foundry/common/data/module.d.mts";
import type { Merge } from "../../../../src/types/utils.d.mts";
import type BaseJournalEntryPage from "../../../../src/foundry/common/documents/journal-entry-page.d.mts";

/* attempting to use the example as a test */

interface QuestSchema extends BaseJournalEntryPage.Schema {
  description: fields.HTMLField;
  steps: fields.ArrayField<fields.StringField>;
}
declare class TestModel extends TypeDataModel<
  QuestSchema,
  BaseJournalEntryPage,
  { description: string; steps: string[] },
  { totalSteps: number }
> {}

const t = new TestModel();

expectTypeOf(t.prepareBaseData).toEqualTypeOf<
  (this: Merge<DataModel<QuestSchema, BaseJournalEntryPage>, { description?: string; steps?: string[] }>) => void
>;
expectTypeOf(t.prepareDerivedData).toEqualTypeOf<
  (
    this: Merge<
      Merge<DataModel<QuestSchema, BaseJournalEntryPage>, { description: string; steps: string[] }>,
      { totalSteps?: number }
    >,
  ) => void
>;
