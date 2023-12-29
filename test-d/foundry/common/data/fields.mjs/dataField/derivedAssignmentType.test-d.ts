import { expectType } from "tsd";
import type { DataField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const allOmitted: DataField.DerivedAssignmentType<number, {}>;
expectType<number | null | undefined>(allOmitted);

declare const withInitial: DataField.DerivedAssignmentType<number, { initial: 42 }>;
expectType<number | null | undefined>(withInitial);

declare const withInitialNullable: DataField.DerivedAssignmentType<number, { initial: 42; nullable: true }>;
expectType<number | null | undefined>(withInitialNullable);

declare const withInitialNullableRequired: DataField.DerivedAssignmentType<
  number,
  { initial: 42; nullable: true; required: true }
>;
expectType<number | null | undefined>(withInitialNullableRequired);

declare const withInitialNullableOptional: DataField.DerivedAssignmentType<
  number,
  { initial: 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialNullableOptional);

declare const withInitialNonNullable: DataField.DerivedAssignmentType<number, { initial: 42; nullable: false }>;
expectType<number | null | undefined>(withInitialNonNullable);

declare const withInitialNonNullableRequired: DataField.DerivedAssignmentType<
  number,
  { initial: 42; nullable: false; required: true }
>;
expectType<number | null | undefined>(withInitialNonNullableRequired);

declare const withInitialNonNullableOptional: DataField.DerivedAssignmentType<
  number,
  { initial: 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialNonNullableOptional);

declare const withInitialRequired: DataField.DerivedAssignmentType<number, { initial: 42; required: true }>;
expectType<number | null | undefined>(withInitialRequired);

declare const withInitialOptional: DataField.DerivedAssignmentType<number, { initial: 42; required: false }>;
expectType<number | null | undefined>(withInitialOptional);

declare const withInitialFunction: DataField.DerivedAssignmentType<number, { initial: () => 42 }>;
expectType<number | null | undefined>(withInitialFunction);

declare const withInitialFunctionNullable: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: true }
>;
expectType<number | null | undefined>(withInitialFunctionNullable);

declare const withInitialFunctionNullableRequired: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: true; required: true }
>;
expectType<number | null | undefined>(withInitialFunctionNullableRequired);

declare const withInitialFunctionNullableOptional: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNullableOptional);

declare const withInitialFunctionNonNullable: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: false }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullable);

declare const withInitialFunctionNonNullableRequired: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: false; required: true }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableRequired);

declare const withInitialFunctionNonNullableOptional: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableOptional);

declare const withInitialFunctionRequired: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; required: true }
>;
expectType<number | null | undefined>(withInitialFunctionRequired);

declare const withInitialFunctionOptional: DataField.DerivedAssignmentType<
  number,
  { initial: () => 42; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionOptional);

declare const withoutInitialNullable: DataField.DerivedAssignmentType<number, { nullable: true }>;
expectType<number | null | undefined>(withoutInitialNullable);

declare const withoutInitialNullableRequired: DataField.DerivedAssignmentType<
  number,
  { nullable: true; required: true }
>;
expectType<number | null>(withoutInitialNullableRequired);

declare const withoutInitialNullableOptional: DataField.DerivedAssignmentType<
  number,
  { nullable: true; required: false }
>;
expectType<number | null | undefined>(withoutInitialNullableOptional);

declare const withoutInitialNonNullable: DataField.DerivedAssignmentType<number, { nullable: false }>;
expectType<number | null | undefined>(withoutInitialNonNullable);

declare const withoutInitialNonNullableRequired: DataField.DerivedAssignmentType<
  number,
  { nullable: false; required: true }
>;
expectType<number>(withoutInitialNonNullableRequired);

declare const withoutInitialNonNullableOptional: DataField.DerivedAssignmentType<
  number,
  { nullable: false; required: false }
>;
expectType<number | null | undefined>(withoutInitialNonNullableOptional);

declare const withoutInitialRequired: DataField.DerivedAssignmentType<number, { required: true }>;
expectType<number>(withoutInitialRequired);

declare const withoutInitialOptional: DataField.DerivedAssignmentType<number, { required: false }>;
expectType<number | null | undefined>(withoutInitialOptional);
