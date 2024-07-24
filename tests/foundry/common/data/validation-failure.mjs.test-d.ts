import { expectTypeOf } from "vitest";

new foundry.data.validation.DataModelValidationFailure();

const myModelValidationFailure = new foundry.data.validation.DataModelValidationFailure({ message: "something" });

expectTypeOf(myModelValidationFailure.asError()).toEqualTypeOf<foundry.data.validation.DataModelValidationError>();

new foundry.data.validation.DataModelValidationError("Failure", { cause: "nested" });
