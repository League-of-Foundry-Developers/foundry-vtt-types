import { expectType } from "tsd";
import type { StringField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const nonSpecific: StringField.MergedOptions<StringFieldOptions>;
expectType<boolean | undefined>(nonSpecific.nullable);

declare const empty: StringField.MergedOptions<{}>;
expectType<true>(empty.nullable);

declare const notNull: StringField.MergedOptions<{ nullable: false }>;
expectType<false>(notNull.nullable);

declare const nullable: StringField.MergedOptions<{ nullable: true }>;
expectType<true>(nullable.nullable);

declare const withChoices: StringField.MergedOptions<{ choices: ("a" | "b")[] }>;
expectType<false>(withChoices.nullable);

declare const withChoicesNotNull: StringField.MergedOptions<{
  choices: ("a" | "b")[];
  nullable: false;
}>;
expectType<false>(withChoicesNotNull.nullable);

declare const withChoicesNullable: StringField.MergedOptions<{
  choices: ("a" | "b")[];
  nullable: true;
}>;
expectType<true>(withChoicesNullable.nullable);
