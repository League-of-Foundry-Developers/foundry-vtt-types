import { expectTypeOf } from "vitest";
import type { DocumentType } from "../../../../src/types/helperTypes.d.mts";
import type { DataModelValidationError } from ",,/../../src/foundry/common/data/validation-failure.d.mts";

const issues = new ClientIssues();

expectTypeOf(issues.getSubTypeCountsFor("")).toEqualTypeOf<ModuleSubTypeCounts | undefined>();
expectTypeOf(issues.getAllSubtypeCounts()).toEqualTypeOf<IterableIterator<[string, ModuleSubTypeCounts]>>();
expectTypeOf(issues.usabilityIssues).toEqualTypeOf<Record<string, ClientIssues.UsabilityIssue>>();
expectTypeOf(issues.packageCompatibilityIssues).toEqualTypeOf<{ error: string[]; warning: string[] }>();
expectTypeOf(issues.validationFailures).toEqualTypeOf<
  Record<DocumentType, Record<string, { name: string; error: DataModelValidationError }>>
>();
