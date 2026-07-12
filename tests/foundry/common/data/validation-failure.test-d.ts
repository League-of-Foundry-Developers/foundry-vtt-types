import { expectTypeOf } from "vitest";

new foundry.data.validation.DataModelValidationFailure();

const myModelValidationFailure = new foundry.data.validation.DataModelValidationFailure("something", {
  fallbackValue: "fallback",
  fieldPath: "system.attribute",
  cause: "nested",
});

expectTypeOf(myModelValidationFailure.asError()).toEqualTypeOf<foundry.data.validation.DataModelValidationError>();
expectTypeOf(myModelValidationFailure.empty).toEqualTypeOf<boolean>();
expectTypeOf(myModelValidationFailure.copyTo(myModelValidationFailure)).toEqualTypeOf<void>();
expectTypeOf(
  myModelValidationFailure.getFailure(),
).toEqualTypeOf<foundry.data.validation.DataModelValidationFailure | null>();
expectTypeOf(myModelValidationFailure.getAllFailures()).toEqualTypeOf<
  Record<string, foundry.data.validation.DataModelValidationFailure>
>();
expectTypeOf(myModelValidationFailure.toObject().fallbackValue).toEqualTypeOf<unknown>();
expectTypeOf(myModelValidationFailure.logAsTable()).toEqualTypeOf<void>();
expectTypeOf(myModelValidationFailure.asHTML()).toEqualTypeOf<string>();

new foundry.data.validation.DataModelValidationError("Failure", { cause: "nested" });
expectTypeOf(
  new foundry.data.validation.DataModelValidationError("Failure").getFailure(),
).toEqualTypeOf<foundry.data.validation.DataModelValidationFailure | null>();
