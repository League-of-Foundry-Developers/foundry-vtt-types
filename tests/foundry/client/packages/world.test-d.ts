import { expectTypeOf } from "vitest";

import World = foundry.packages.World;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const world: World;
expectTypeOf(world.favorite).toEqualTypeOf<false>();
expectTypeOf(world.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(world.install()).toEqualTypeOf<void>();
expectTypeOf(world.uninstall()).toEqualTypeOf<void>();
expectTypeOf(world.getSystemBadge()).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();

expectTypeOf(
  World.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, world, {}),
).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(World.uninstall("")).toEqualTypeOf<void>();

expectTypeOf(await World.fromRemoteManifest("", { strict: false })).toBeNull();
