import { expectTypeOf } from "vitest";

import Module = foundry.packages.Module;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const mod: Module;
expectTypeOf(mod.favorite).toEqualTypeOf<false>();
expectTypeOf(mod.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(mod.install()).toEqualTypeOf<void>();
expectTypeOf(mod.uninstall()).toEqualTypeOf<void>();
expectTypeOf(mod.active).toEqualTypeOf<boolean>();

expectTypeOf(
  Module.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, {}, {}),
).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
expectTypeOf(Module.uninstall("")).toEqualTypeOf<void>();

const clientPackage = await Module.fromRemoteManifest("", { strict: true });
if (clientPackage) {
  expectTypeOf(clientPackage.favorite).toEqualTypeOf<false>();
  expectTypeOf(clientPackage.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.PackageCompatibilityBadge | null>();
  expectTypeOf(clientPackage.install()).toEqualTypeOf<void>();
  expectTypeOf(clientPackage.uninstall()).toEqualTypeOf<void>();
}
