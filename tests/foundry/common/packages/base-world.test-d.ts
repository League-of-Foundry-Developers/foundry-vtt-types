import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

const baseWorld = new foundry.packages.BaseWorld({});

expectTypeOf(foundry.packages.BaseWorld.type).toEqualTypeOf<"world">();
expectTypeOf(foundry.packages.BaseWorld.icon).toEqualTypeOf<string>();
expectTypeOf(foundry.packages.BaseWorld.migrateData({})).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(
  foundry.packages.BaseWorld.testAvailability({}, {}),
).toEqualTypeOf<foundry.CONST.PACKAGE_AVAILABILITY_CODES>();

// Following should check out, validated in world (use `game.world` to grab the instance)
// The version handling is weird because it's an alteration of the schema
// Good demo of complex type handling
expectTypeOf(
  baseWorld.schema.fields.version.validate(null),
).toEqualTypeOf<foundry.data.validation.DataModelValidationFailure | void>();

// schema fields
expectTypeOf(baseWorld.system).toEqualTypeOf<string>();
expectTypeOf(baseWorld.background).toEqualTypeOf<string | undefined>();
expectTypeOf(baseWorld.joinTheme).toEqualTypeOf<keyof typeof foundry.CONST.WORLD_JOIN_THEMES | undefined>();
expectTypeOf(baseWorld.coreVersion).toEqualTypeOf<string>();
expectTypeOf(baseWorld.systemVersion).toEqualTypeOf<string>();
expectTypeOf(baseWorld.lastPlayed).toEqualTypeOf<string | undefined>();
expectTypeOf(baseWorld.playtime).toEqualTypeOf<number>();
expectTypeOf(baseWorld.nextSession).toEqualTypeOf<string | null>();
expectTypeOf(baseWorld.resetKeys).toEqualTypeOf<boolean | undefined>();
expectTypeOf(baseWorld.safeMode).toEqualTypeOf<boolean | undefined>();
expectTypeOf(baseWorld.version).toEqualTypeOf<string | null>();
