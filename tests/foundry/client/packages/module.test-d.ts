import { expectTypeOf } from "vitest";

import Module = foundry.packages.Module;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const mod: Module;
expectTypeOf(mod.favorite).toEqualTypeOf<false>();
expectTypeOf(mod.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(mod.install()).toEqualTypeOf<void>();
expectTypeOf(mod.uninstall()).toEqualTypeOf<void>();
expectTypeOf(mod.active).toEqualTypeOf<boolean>();

expectTypeOf(
  Module.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, mod, {}),
).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(Module.uninstall("")).toEqualTypeOf<void>();

expectTypeOf(await Module.fromRemoteManifest("", { strict: false })).toBeNull();
