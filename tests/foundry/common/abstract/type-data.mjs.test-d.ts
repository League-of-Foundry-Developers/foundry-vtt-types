import { expectTypeOf, test } from "vitest";
import type { DeepPartial, EmptyObject } from "fvtt-types/utils";

import TypeDataModel = foundry.abstract.TypeDataModel;
import type Document from "../../../../src/foundry/common/abstract/document.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseUpdateOperation,
} from "../../../../src/foundry/common/abstract/_types.d.mts";

import fields = foundry.data.fields;

/* attempting to use the example as a test */

export interface QuestSchema extends JournalEntryPage.Schema {
  description: fields.HTMLField<{ required: false; blank: true; initial: "" }>;
  steps: fields.ArrayField<fields.StringField<{ required: true }>>;
}

// Since this changes the schema `this.description` will have no perfect type. For example, during assignment it should be `HTMLElement` but during access it should be `string`.
// This is a limitation of the current implementation. If a dynamic getter/setter pair becomes possible this could be fixed.
// See https://github.com/microsoft/TypeScript/issues/43826
type BaseQuestData = {
  // Overrides the schema.
  description: HTMLElement;
  questName: string;
  some: {
    deep?: {
      baseProp: string;
      prop: string;
    };
  };
};

type StepData = { name: string };

type DerivedQuestData = {
  totalSteps: number;
  steps: StepData[];
  some: {
    deep?: {
      derivedProp: number;
      prop: number;
    };
  };
};

// Test With specified Base and DerivedData.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel extends TypeDataModel<QuestSchema, JournalEntryPage.Implementation, BaseQuestData, DerivedQuestData> {
  otherMethod() {}

  // This override may seem random but it's a regression test for this error:
  //   Class 'QuestModel' incorrectly extends base class 'TypeDataModel<QuestSchema, JournalEntryPage.Implementation, BaseQuestData, DerivedQuestData>'.
  //     Property '_initialize' is protected but type 'QuestModel' is not a class derived from 'DataModel<Schema, Parent, ExtraConstructorOptions>'.
  // See: https://gist.github.com/LukeAbby/b9fd57eeba778a25297721e88b3e6bdd
  override _initialize(): void {}

  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    this.otherMethod();

    // From schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement | undefined>;

    // `some` is partial because of being new in `prepareBaseData`.
    // `deep` is optional due to the type definition.
    expectTypeOf(this.some!.deep!.baseProp).toEqualTypeOf<string>();
    expectTypeOf(this.some!.deep!.prop).toEqualTypeOf<string>();

    // Should match the schema type, not the type after derived data.
    expectTypeOf(this.steps).toEqualTypeOf<string[]>();

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
    expectTypeOf(this.steps).toEqualTypeOf<StepData[] | undefined>();

    // From BaseData
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement>;

    expectTypeOf(this.totalSteps).toEqualTypeOf<number | undefined>();

    expectTypeOf(this.some.deep!.derivedProp).toEqualTypeOf<number>();
    expectTypeOf(this.some.deep!.prop).toEqualTypeOf<number>();

    // @ts-expect-error this key was declared nowhere.
    this.afsdasdfqeqw + 1;

    // @ts-expect-error The this parameter is incompatible.
    this.prepareBaseData();

    // @ts-expect-error Recursively calling is technically possible but wouldn't be desired. Removing it also seems to reduce the type complexity.
    this.prepareDerivedData();
  }

  method() {
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement>();
    expectTypeOf(this._source.description).toEqualTypeOf<string | undefined>();
    // Note(LukeAbby): Currently not working but should.
    expectTypeOf(this.some.deep!.baseProp).toEqualTypeOf<string>();
    expectTypeOf(this.some.deep!.derivedProp).toEqualTypeOf<number>();
    expectTypeOf(this.some.deep!.prop).toEqualTypeOf<number>();
    expectTypeOf(this.steps).toEqualTypeOf<StepData[]>();
  }

  protected override async _preCreate(
    data: TypeDataModel.ParentAssignmentType<QuestSchema, JournalEntryPage.Implementation>,
    _options: Document.Database.PreCreateOptions<DatabaseCreateOperation>,
    _user: User.Implementation,
  ): Promise<boolean | void> {
    expectTypeOf(data.system.steps).toEqualTypeOf<string[]>();
  }

  protected override async _preUpdate(
    changes: DeepPartial<TypeDataModel.ParentAssignmentType<QuestSchema, JournalEntryPage.Implementation>>,
    _options: Document.Database.PreUpdateOptions<DatabaseUpdateOperation>,
    _user: User.Implementation,
  ): Promise<boolean | void> {
    expectTypeOf(changes.system?.steps).toEqualTypeOf<string[] | undefined>();
  }
}

/* Test with default BaseData and DerivedData */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class QuestModel2 extends foundry.abstract.TypeDataModel<QuestSchema, JournalEntryPage.Implementation> {
  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

    // Comes from the schema
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;

    // @ts-expect-error there shouldn't be an index signature.
    this.nonexistantProp;

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
class QuestModel3 extends foundry.abstract.TypeDataModel<QuestSchema, JournalEntryPage.Implementation, BaseQuestData> {
  override prepareBaseData(this: TypeDataModel.PrepareBaseDataThis<this>): void {
    // From JournalEntryPage
    expectTypeOf(this.flags).toEqualTypeOf<EmptyObject>;

    // From BaseData
    expectTypeOf(this.steps).toEqualTypeOf<string[]>;
    expectTypeOf(this.description).toEqualTypeOf<HTMLElement | undefined>;

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

// This is a regression test for a case where `TypeDataModel` was written as `...args: ConstructorParameters<typeof DataModel>` instead of `...args: ConstructorParameters<typeof DataModel<Schema, Parent>>`.
// Thus causing the constructor to be typed with no respect to the `Parent`.
test("TypeDataModel parent regression test", () => {
  class CustomTypeDataModel extends foundry.abstract.TypeDataModel<any, Item.Implementation> {}

  // @ts-expect-error - This should not work as it is attempting to give an `Actor` to `TypeDataModel` where it's configured with a parent of `Item`.
  new CustomTypeDataModel({}, { parent: new Actor.implementation({ name: "test" }) });
});
