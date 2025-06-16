import { expectTypeOf } from "vitest";

import System = foundry.packages.System;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const system: System;
expectTypeOf(system.favorite).toEqualTypeOf<false>();
expectTypeOf(system.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(system.install()).toEqualTypeOf<void>();
expectTypeOf(system.uninstall()).toEqualTypeOf<void>();

expectTypeOf(
  System.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(System.uninstall("")).toEqualTypeOf<void>();

const clientPackage = await System.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}
