import { expectType } from "tsd";
import type { DataField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const allOmitted: DataField.DerivedInitializedType<number, {}>;
expectType<number | undefined>(allOmitted);

declare const withInitial: DataField.DerivedInitializedType<number, { initial: 42 }>;
expectType<number | undefined>(withInitial);

declare const withInitialNullable: DataField.DerivedInitializedType<number, { initial: 42; nullable: true }>;
expectType<number | null | undefined>(withInitialNullable);

declare const withInitialNullableRequired: DataField.DerivedInitializedType<
  number,
  { initial: 42; nullable: true; required: true }
>;
expectType<number | null>(withInitialNullableRequired);

declare const withInitialNullableOptional: DataField.DerivedInitializedType<
  number,
  { initial: 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialNullableOptional);

declare const withInitialNonNullable: DataField.DerivedInitializedType<number, { initial: 42; nullable: false }>;
expectType<number | undefined>(withInitialNonNullable);

declare const withInitialNonNullableRequired: DataField.DerivedInitializedType<
  number,
  { initial: 42; nullable: false; required: true }
>;
expectType<number>(withInitialNonNullableRequired);

declare const withInitialNonNullableOptional: DataField.DerivedInitializedType<
  number,
  { initial: 42; nullable: false; required: false }
>;
expectType<number | undefined>(withInitialNonNullableOptional);

declare const withInitialRequired: DataField.DerivedInitializedType<number, { initial: 42; required: true }>;
expectType<number>(withInitialRequired);

declare const withInitialOptional: DataField.DerivedInitializedType<number, { initial: 42; required: false }>;
expectType<number | undefined>(withInitialOptional);

declare const withInitialFunction: DataField.DerivedInitializedType<number, { initial: () => 42 }>;
expectType<number | undefined>(withInitialFunction);

declare const withInitialFunctionNullable: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: true }
>;
expectType<number | null | undefined>(withInitialFunctionNullable);

declare const withInitialFunctionNullableRequired: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: true; required: true }
>;
expectType<number | null>(withInitialFunctionNullableRequired);

declare const withInitialFunctionNullableOptional: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNullableOptional);

declare const withInitialFunctionNonNullable: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: false }
>;
expectType<number | undefined>(withInitialFunctionNonNullable);

declare const withInitialFunctionNonNullableRequired: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: false; required: true }
>;
expectType<number>(withInitialFunctionNonNullableRequired);

declare const withInitialFunctionNonNullableOptional: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableOptional);

declare const withInitialFunctionRequired: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; required: true }
>;
expectType<number>(withInitialFunctionRequired);

declare const withInitialFunctionOptional: DataField.DerivedInitializedType<
  number,
  { initial: () => 42; required: false }
>;
expectType<number | undefined>(withInitialFunctionOptional);

declare const withoutInitialNullable: DataField.DerivedInitializedType<number, { nullable: true }>;
expectType<number | null | undefined>(withoutInitialNullable);

declare const withoutInitialNullableRequired: DataField.DerivedInitializedType<
  number,
  { nullable: true; required: true }
>;
expectType<number | null>(withoutInitialNullableRequired);

declare const withoutInitialNullableOptional: DataField.DerivedInitializedType<
  number,
  { nullable: true; required: false }
>;
expectType<number | null | undefined>(withoutInitialNullableOptional);

declare const withoutInitialNonNullable: DataField.DerivedInitializedType<number, { nullable: false }>;
expectType<number | undefined>(withoutInitialNonNullable);

declare const withoutInitialNonNullableRequired: DataField.DerivedInitializedType<
  number,
  { nullable: false; required: true }
>;
expectType<number>(withoutInitialNonNullableRequired);

declare const withoutInitialNonNullableOptional: DataField.DerivedInitializedType<
  number,
  { nullable: false; required: false }
>;
expectType<number | undefined>(withoutInitialNonNullableOptional);

declare const withoutInitialRequired: DataField.DerivedInitializedType<number, { required: true }>;
expectType<number>(withoutInitialRequired);

declare const withoutInitialOptional: DataField.DerivedInitializedType<number, { required: false }>;
expectType<number | undefined>(withoutInitialOptional);
