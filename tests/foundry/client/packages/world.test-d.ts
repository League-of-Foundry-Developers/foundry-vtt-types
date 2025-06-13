import { expectTypeOf } from "vitest";

declare const world: World;
expectTypeOf(world.favorite).toEqualTypeOf<false>();
expectTypeOf(world.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(world.install()).toEqualTypeOf<void>();
expectTypeOf(world.uninstall()).toEqualTypeOf<void>();
expectTypeOf(world.getSystemBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();

expectTypeOf(
  World.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(World.uninstall("")).toEqualTypeOf<void>();

const clientPackage = await World.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}
