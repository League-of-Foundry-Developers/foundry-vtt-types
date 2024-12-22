import { expectTypeOf } from "vitest";

import Document = foundry.abstract.Document;
import DataModelValidationError = foundry.data.validation.DataModelValidationError;

const issues = new ClientIssues();

expectTypeOf(issues.getSubTypeCountsFor("")).toEqualTypeOf<ModuleSubTypeCounts | undefined>();
expectTypeOf(issues.getAllSubtypeCounts()).toEqualTypeOf<IterableIterator<[string, ModuleSubTypeCounts]>>();
expectTypeOf(issues.usabilityIssues).toEqualTypeOf<Record<string, ClientIssues.UsabilityIssue>>();
expectTypeOf(issues.packageCompatibilityIssues).toEqualTypeOf<{ error: string[]; warning: string[] }>();
expectTypeOf(issues.validationFailures).toEqualTypeOf<
  Record<Document.Type, Record<string, { name: string; error: DataModelValidationError }>>
>();
