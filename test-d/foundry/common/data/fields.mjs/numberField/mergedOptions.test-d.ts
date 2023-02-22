import { expectType } from "tsd";
import type { NumberField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const nonSpecific: NumberField.MergedOptions<NumberFieldOptions>;
expectType<boolean | undefined>(nonSpecific.nullable);

declare const empty: NumberField.MergedOptions<{}>;
expectType<true>(empty.nullable);

declare const undef: NumberField.MergedOptions<{ choices: undefined }>;
expectType<true>(undef.nullable);

declare const notNull: NumberField.MergedOptions<{ nullable: false }>;
expectType<false>(notNull.nullable);

declare const nullable: NumberField.MergedOptions<{ nullable: true }>;
expectType<true>(nullable.nullable);

declare const withChoices: NumberField.MergedOptions<{ choices: (1 | 2)[] }>;
expectType<false>(withChoices.nullable);

declare const withChoicesNotNull: NumberField.MergedOptions<{
  choices: (1 | 2)[];
  nullable: false;
}>;
expectType<false>(withChoicesNotNull.nullable);

declare const withChoicesNullable: NumberField.MergedOptions<{
  choices: (1 | 2)[];
  nullable: true;
}>;
expectType<true>(withChoicesNullable.nullable);
