import { expectType } from "tsd";
import type { StringField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const nonSpecific: StringField.MergedOptions<StringFieldOptions>;
expectType<boolean | undefined>(nonSpecific.nullable);
expectType<boolean | undefined>(nonSpecific.blank);

declare const empty: StringField.MergedOptions<{}>;
expectType<false>(empty.nullable);
expectType<true>(empty.blank);

declare const undef: StringField.MergedOptions<{ choices: undefined }>;
expectType<false>(undef.nullable);
expectType<true>(undef.blank);

declare const notNull: StringField.MergedOptions<{ nullable: false; blank: false }>;
expectType<false>(notNull.nullable);
expectType<false>(notNull.blank);

declare const nullable: StringField.MergedOptions<{ nullable: true; blank: true }>;
expectType<true>(nullable.nullable);
expectType<true>(nullable.blank);

declare const withChoices: StringField.MergedOptions<{ choices: ("a" | "b")[] }>;
expectType<false>(withChoices.nullable);
expectType<false>(withChoices.blank);

declare const withChoicesNotNull: StringField.MergedOptions<{
  choices: ("a" | "b")[];
  nullable: false;
  blank: false;
}>;
expectType<false>(withChoicesNotNull.nullable);
expectType<false>(withChoicesNotNull.blank);

declare const withChoicesNullable: StringField.MergedOptions<{
  choices: ("a" | "b")[];
  nullable: true;
  blank: true;
}>;
expectType<true>(withChoicesNullable.nullable);
expectType<true>(withChoicesNullable.blank);
