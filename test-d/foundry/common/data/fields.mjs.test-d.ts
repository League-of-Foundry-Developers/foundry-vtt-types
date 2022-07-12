import { NumberField } from './../../../../src/foundry/common/data/fields.mjs.d';
import { expectType } from 'tsd';

const numberFieldOptions = {
  required: true,
  nullable: false,
  initial: 1
} as const;
const numberField = new NumberField(numberFieldOptions);

numberField.options;
numberField.required;
numberField.initial;

// type X = typeof numberField & AnyDataField extends DataField<any, infer ExtendsOptions> ? ExtendsOptions : never;
// type Y = typeof numberField extends DataField<any, infer ExtendsOptions>
//   ? Exclude<ExtendsOptions['T'], undefined | null>
//   : never;

expectType<typeof numberFieldOptions>(numberField.options);
expectType<number>(numberField._cast(1));
