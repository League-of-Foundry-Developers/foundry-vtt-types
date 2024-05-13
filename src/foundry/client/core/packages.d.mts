import type { AnyConstructorFor, Mixin } from "../../../types/utils.d.mts";

declare class ClientPackage {}

declare global {
  /**
   * A client-side mixin used for all Package types.
   * @param BasePackage - The parent BasePackage class being mixed
   * @returns A BasePackage subclass mixed with ClientPackage features
   */
  function ClientPackageMixin<BaseClass extends AnyConstructorFor<typeof foundry.packages.BasePackage>>(
    BasePackage: BaseClass,
  ): Mixin<typeof ClientPackage, BaseClass>;

  class Module extends ClientPackageMixin(foundry.packages.BaseModule) {}

  class System extends ClientPackageMixin(foundry.packages.BaseSystem) {}

  class World extends ClientPackageMixin(foundry.packages.BaseWorld) {}
}
