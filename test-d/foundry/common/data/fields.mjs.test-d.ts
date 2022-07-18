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

expectType<typeof numberFieldOptions>(numberField.options);
expectType<number>(numberField._cast(1));
