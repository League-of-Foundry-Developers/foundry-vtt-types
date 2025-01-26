import { expectTypeOf } from "vitest";

declare const mod: Module;
expectTypeOf(mod.favorite).toEqualTypeOf<false>();
expectTypeOf(mod.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(mod.install()).toEqualTypeOf<void>();
expectTypeOf(mod.uninstall()).toEqualTypeOf<void>();
expectTypeOf(mod.active).toEqualTypeOf<boolean>();

expectTypeOf(
  Module.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(Module.uninstall("")).toEqualTypeOf<void>();

let clientPackage = await Module.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}

declare const system: System;
expectTypeOf(system.favorite).toEqualTypeOf<false>();
expectTypeOf(system.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(system.install()).toEqualTypeOf<void>();
expectTypeOf(system.uninstall()).toEqualTypeOf<void>();

expectTypeOf(
  System.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
expectTypeOf(System.uninstall("")).toEqualTypeOf<void>();

clientPackage = await System.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}

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

clientPackage = await World.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackage.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}
