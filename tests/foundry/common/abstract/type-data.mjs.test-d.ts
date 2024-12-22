import { expectTypeOf } from "vitest";
import type { DeepPartial, EmptyObject } from "fvtt-types/utils";

import fields = foundry.data.fields;
import BaseUser = foundry.documents.BaseUser;
import BaseJournalEntryPage = foundry.documents.BaseJournalEntryPage;

import TypeDataModel = foundry.abstract.TypeDataModel;

/* attempting to use the example as a test */

export interface QuestSchema extends BaseJournalEntryPage.Schema {
  description: fields.HTMLField<{ required: false; blank: true; initial: "" }>;
  steps: fields.ArrayField<fields.StringField<{ required: true }>>;
}

type BaseQuestData = {
  // Overrides the schema.
  // Since this changes the schema `this.description` will have no perfect type. During assignment it should be `HTMLElement` but during access it should be `string`.
  // This is a limitation of the current implementation. If a dynamic getter/setter pair becomes possible this could be fixed.
  // See https://github.com/microsoft/TypeScript/issues/43826
  description: HTMLElement;
  questName: string;
};
type DerivedQuestData = { totalSteps: number };

// Test With specified Base and DerivedData.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel extends TypeDataModel<QuestSchema, BaseJournalEntryPage, BaseQuestData, DerivedQuestData> {
  otherMethod() {}

  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    this.otherMethod();

    // From schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<Partial<HTMLElement> | undefined>;

    // @ts-expect-error Derived Data is not available yet
    this.totalSteps + 1;

    // @ts-expect-error Recursively calling is technically possible but wouldn't be desired. Removing it also seems to reduce the type complexity.
    this.prepareBaseData();

    // @ts-expect-error The this parameter is incompatible.
    this.prepareDerivedData();
  }

  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    this.otherMethod();

    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

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

  protected override async _preCreate(
    data: TypeDataModel.ParentAssignmentType<this>,
    options: TypeDataModel.TypeDataModelModificationOptions,
    user: BaseUser,
  ): Promise<boolean | void> {
    expectTypeOf(data.system.steps).toEqualTypeOf<string[]>();

    expectTypeOf(options).toEqualTypeOf<TypeDataModel.TypeDataModelModificationOptions>();
    expectTypeOf(user).toEqualTypeOf<BaseUser>();
  }

  protected override async _preUpdate(
    data: DeepPartial<TypeDataModel.ParentAssignmentType<this>>,
    options: TypeDataModel.TypeDataModelModificationOptions,
    userId: string,
  ): Promise<boolean | void> {
    expectTypeOf(data.system?.steps).toEqualTypeOf<string[] | undefined>();

    expectTypeOf(options).toEqualTypeOf<TypeDataModel.TypeDataModelModificationOptions>();
    expectTypeOf(userId).toEqualTypeOf<string>();
  }
}

/* Test with default BaseData and DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel2 extends foundry.abstract.TypeDataModel<QuestSchema, BaseJournalEntryPage> {
  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

    // Comes from the schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error there is no base data this time.
    this.questName;

    // @ts-expect-error there is no derived data this time.
    this.totalSteps + 1;
  }

  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

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
  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<Partial<HTMLElement> | undefined>;

    // @ts-expect-error There is no derived Data
    this.totalSteps + 1;
  }

  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement>;

    // @ts-expect-error There is no DerivedData
    this.totalSteps + 1;
  }
}

class CustomTypeDataModel extends foundry.abstract.TypeDataModel<any, Item.ConfiguredInstance> {}

// This is a regression test for a case where `TypeDataModel` was written as `...args: ConstructorParameters<typeof DataModel>` instead of `...args: ConstructorParameters<typeof DataModel<Schema, Parent>>`.
// Thus causing the constructor to be typed with no respect to the `Parent`.
// @ts-expect-error - This should not work as it is attempting to give an `Actor` to `TypeDataModel` where it's configured with a parent of `Item`.
new CustomTypeDataModel({}, { parent: new Actor({ name: "test" }) });
