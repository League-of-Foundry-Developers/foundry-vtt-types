import { expectType } from "tsd";
import type { DataField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const allOmitted: DataField.InitializedType<number, {}>;
expectType<number | undefined>(allOmitted);

declare const withInitial: DataField.InitializedType<number, { initial: 42 }>;
expectType<number>(withInitial);

declare const withInitialNullable: DataField.InitializedType<number, { initial: 42; nullable: true }>;
expectType<number | null>(withInitialNullable);

declare const withInitialNullableRequired: DataField.InitializedType<
  number,
  { initial: 42; nullable: true; required: true }
>;
expectType<number | null>(withInitialNullableRequired);

declare const withInitialNullableOptional: DataField.InitializedType<
  number,
  { initial: 42; nullable: true; required: false }
>;
expectType<number | null>(withInitialNullableOptional);

declare const withInitialNonNullable: DataField.InitializedType<number, { initial: 42; nullable: false }>;
expectType<number>(withInitialNonNullable);

declare const withInitialNonNullableRequired: DataField.InitializedType<
  number,
  { initial: 42; nullable: false; required: true }
>;
expectType<number>(withInitialNonNullableRequired);

declare const withInitialNonNullableOptional: DataField.InitializedType<
  number,
  { initial: 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialNonNullableOptional);

declare const withInitialRequired: DataField.AssignmentType<number, { initial: 42; required: true }>;
expectType<number>(withInitialRequired);

declare const withInitialOptional: DataField.AssignmentType<number, { initial: 42; required: false }>;
expectType<number>(withInitialOptional);

declare const withInitialFunction: DataField.InitializedType<number, { initial: () => 42 }>;
expectType<number>(withInitialFunction);

declare const withInitialFunctionNullable: DataField.InitializedType<number, { initial: () => 42; nullable: true }>;
expectType<number | null>(withInitialFunctionNullable);

declare const withInitialFunctionNullableRequired: DataField.InitializedType<
  number,
  { initial: () => 42; nullable: true; required: true }
>;
expectType<number | null>(withInitialFunctionNullableRequired);

declare const withInitialFunctionNullableOptional: DataField.InitializedType<
  number,
  { initial: () => 42; nullable: true; required: false }
>;
expectType<number | null>(withInitialFunctionNullableOptional);

declare const withInitialFunctionNonNullable: DataField.InitializedType<number, { initial: () => 42; nullable: false }>;
expectType<number>(withInitialFunctionNonNullable);

declare const withInitialFunctionNonNullableRequired: DataField.InitializedType<
  number,
  { initial: () => 42; nullable: false; required: true }
>;
expectType<number>(withInitialFunctionNonNullableRequired);

declare const withInitialFunctionNonNullableOptional: DataField.InitializedType<
  number,
  { initial: () => 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableOptional);

declare const withInitialFunctionRequired: DataField.AssignmentType<number, { initial: () => 42; required: true }>;
expectType<number>(withInitialFunctionRequired);

declare const withInitialFunctionOptional: DataField.AssignmentType<number, { initial: () => 42; required: false }>;
expectType<number>(withInitialFunctionOptional);

declare const withoutInitialNullable: DataField.InitializedType<number, { nullable: true }>;
expectType<number | null | undefined>(withoutInitialNullable);

declare const withoutInitialNullableRequired: DataField.InitializedType<number, { nullable: true; required: true }>;
expectType<number | null>(withoutInitialNullableRequired);

declare const withoutInitialNullableOptional: DataField.InitializedType<number, { nullable: true; required: false }>;
expectType<number | null | undefined>(withoutInitialNullableOptional);

declare const withoutInitialNonNullable: DataField.InitializedType<number, { nullable: false }>;
expectType<number | undefined>(withoutInitialNonNullable);

declare const withoutInitialNonNullableRequired: DataField.InitializedType<number, { nullable: false; required: true }>;
expectType<number>(withoutInitialNonNullableRequired);

declare const withoutInitialNonNullableOptional: DataField.InitializedType<
  number,
  { nullable: false; required: false }
>;
expectType<number | undefined>(withoutInitialNonNullableOptional);

declare const withoutInitialRequired: DataField.AssignmentType<number, { required: true }>;
expectType<number>(withoutInitialRequired);

declare const withoutInitialOptional: DataField.AssignmentType<number, { required: false }>;
expectType<number | undefined>(withoutInitialOptional);
