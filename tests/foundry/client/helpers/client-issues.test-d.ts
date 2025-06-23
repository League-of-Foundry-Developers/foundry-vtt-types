import { expectTypeOf } from "vitest";

import Document = foundry.abstract.Document;
import DataModelValidationError = foundry.data.validation.DataModelValidationError;
import ClientIssues = foundry.helpers.ClientIssues;

const issues = new ClientIssues();

expectTypeOf(issues.getSubTypeCountsFor("")).toEqualTypeOf<ClientIssues.ModuleSubTypeCounts | undefined>();
expectTypeOf(issues.getAllSubtypeCounts()).toEqualTypeOf<
  IterableIterator<[string, ClientIssues.ModuleSubTypeCounts]>
>();
expectTypeOf(issues.usabilityIssues).toEqualTypeOf<Record<string, ClientIssues.UsabilityIssue>>();
expectTypeOf(issues.packageCompatibilityIssues).toEqualTypeOf<{ error: string[]; warning: string[] }>();
expectTypeOf(issues.validationFailures).toEqualTypeOf<
  Record<Document.Type, Record<string, { name: string; error: DataModelValidationError }>>
>();
