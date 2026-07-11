import { expectTypeOf } from "vitest";

import System = foundry.packages.System;
import ClientPackageMixin = foundry.packages.ClientPackageMixin;

declare const system: System;
expectTypeOf(system.favorite).toEqualTypeOf<false>();
expectTypeOf(system.getVersionBadge()).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(system.install()).toEqualTypeOf<void>();
expectTypeOf(system.uninstall()).toEqualTypeOf<void>();

expectTypeOf(
  System.getVersionBadge(CONST.PACKAGE_AVAILABILITY_CODES.MISSING_DEPENDENCY, system, {}),
).toEqualTypeOf<ClientPackageMixin.CompatibilityBadge | null>();
expectTypeOf(System.uninstall("")).toEqualTypeOf<void>();

expectTypeOf(await System.fromRemoteManifest("", { strict: false })).toBeNull();
