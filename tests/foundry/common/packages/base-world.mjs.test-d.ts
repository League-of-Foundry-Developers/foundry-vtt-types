import { expectTypeOf } from "vitest";
import DataModelValidationFailure = foundry.data.DataModelValidationFailure;

const myWorld = new foundry.packages.BaseWorld({
  changelog: "Test",
});

// Following should check out, validated in world (use `game.world` to grab the instance)
// The version handling is weird because it's an alteration of the schema
// Good demo of complex type handling
expectTypeOf(myWorld.schema.fields.version.validate(null)).toEqualTypeOf<DataModelValidationFailure | undefined>();
expectTypeOf(myWorld.version).toEqualTypeOf<string | null>();
