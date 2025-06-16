import { expectTypeOf } from "vitest";

import World = foundry.packages.World;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const world: World;
expectTypeOf(world.favorite).toEqualTypeOf<false>();
expectTypeOf(world.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(world.install()).toEqualTypeOf<void>();
expectTypeOf(world.uninstall()).toEqualTypeOf<void>();
expectTypeOf(world.getSystemBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();

expectTypeOf(
  World.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(World.uninstall("")).toEqualTypeOf<void>();

const clientPackage = await World.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}
