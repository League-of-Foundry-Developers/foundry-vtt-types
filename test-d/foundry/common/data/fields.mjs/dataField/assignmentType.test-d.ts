import { expectType } from "tsd";
import type { DataField } from "../../../../../../src/foundry/common/data/fields.mjs";

declare const allOmitted: DataField.AssignmentType<number, {}>;
expectType<number | null | undefined>(allOmitted);

declare const withInitial: DataField.AssignmentType<number, { initial: 42 }>;
expectType<number | null | undefined>(withInitial);

declare const withInitialNullable: DataField.AssignmentType<number, { initial: 42; nullable: true }>;
expectType<number | null | undefined>(withInitialNullable);

declare const withInitialNullableRequired: DataField.AssignmentType<
  number,
  { initial: 42; nullable: true; required: true }
>;
expectType<number | null | undefined>(withInitialNullableRequired);

declare const withInitialNullableOptional: DataField.AssignmentType<
  number,
  { initial: 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialNullableOptional);

declare const withInitialNonNullable: DataField.AssignmentType<number, { initial: 42; nullable: false }>;
expectType<number | null | undefined>(withInitialNonNullable);

declare const withInitialNonNullableRequired: DataField.AssignmentType<
  number,
  { initial: 42; nullable: false; required: true }
>;
expectType<number | null | undefined>(withInitialNonNullableRequired);

declare const withInitialNonNullableOptional: DataField.AssignmentType<
  number,
  { initial: 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialNonNullableOptional);

declare const withInitialRequired: DataField.AssignmentType<number, { initial: 42; required: true }>;
expectType<number | null | undefined>(withInitialRequired);

declare const withInitialOptional: DataField.AssignmentType<number, { initial: 42; required: false }>;
expectType<number | null | undefined>(withInitialOptional);

declare const withInitialFunction: DataField.AssignmentType<number, { initial: () => 42 }>;
expectType<number | null | undefined>(withInitialFunction);

declare const withInitialFunctionNullable: DataField.AssignmentType<number, { initial: () => 42; nullable: true }>;
expectType<number | null | undefined>(withInitialFunctionNullable);

declare const withInitialFunctionNullableRequired: DataField.AssignmentType<
  number,
  { initial: () => 42; nullable: true; required: true }
>;
expectType<number | null | undefined>(withInitialFunctionNullableRequired);

declare const withInitialFunctionNullableOptional: DataField.AssignmentType<
  number,
  { initial: () => 42; nullable: true; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNullableOptional);

declare const withInitialFunctionNonNullable: DataField.AssignmentType<number, { initial: () => 42; nullable: false }>;
expectType<number | null | undefined>(withInitialFunctionNonNullable);

declare const withInitialFunctionNonNullableRequired: DataField.AssignmentType<
  number,
  { initial: () => 42; nullable: false; required: true }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableRequired);

declare const withInitialFunctionNonNullableOptional: DataField.AssignmentType<
  number,
  { initial: () => 42; nullable: false; required: false }
>;
expectType<number | null | undefined>(withInitialFunctionNonNullableOptional);

declare const withInitialFunctionRequired: DataField.AssignmentType<number, { initial: () => 42; required: true }>;
expectType<number | null | undefined>(withInitialFunctionRequired);

declare const withInitialFunctionOptional: DataField.AssignmentType<number, { initial: () => 42; required: false }>;
expectType<number | null | undefined>(withInitialFunctionOptional);

declare const withoutInitialNullable: DataField.AssignmentType<number, { nullable: true }>;
expectType<number | null | undefined>(withoutInitialNullable);

declare const withoutInitialNullableRequired: DataField.AssignmentType<number, { nullable: true; required: true }>;
expectType<number | null>(withoutInitialNullableRequired);

declare const withoutInitialNullableOptional: DataField.AssignmentType<number, { nullable: true; required: false }>;
expectType<number | null | undefined>(withoutInitialNullableOptional);

declare const withoutInitialNonNullable: DataField.AssignmentType<number, { nullable: false }>;
expectType<number | null | undefined>(withoutInitialNonNullable);

declare const withoutInitialNonNullableRequired: DataField.AssignmentType<number, { nullable: false; required: true }>;
expectType<number>(withoutInitialNonNullableRequired);

declare const withoutInitialNonNullableOptional: DataField.AssignmentType<number, { nullable: false; required: false }>;
expectType<number | null | undefined>(withoutInitialNonNullableOptional);

declare const withoutInitialRequired: DataField.AssignmentType<number, { required: true }>;
expectType<number | null>(withoutInitialRequired);

declare const withoutInitialOptional: DataField.AssignmentType<number, { required: false }>;
expectType<number | null | undefined>(withoutInitialOptional);
