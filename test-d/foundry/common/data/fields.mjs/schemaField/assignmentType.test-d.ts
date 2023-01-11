import { expectType } from "tsd";
import type * as fields from "../../../../../../src/foundry/common/data/fields.mjs";

declare const flatSchema: fields.SchemaField.AssignmentType<{
  numberField: fields.NumberField;
  stringField: fields.StringField;
}>;
expectType<{
  numberField?: number | null | undefined;
  stringField?: string | undefined;
}>(flatSchema);
