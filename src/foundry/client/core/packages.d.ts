import type DataModel from '../../common/abstract/data.mjs';
import type BasePackage from '../../common/packages/base-package.mjs';

declare global {
  /**
   * A client-side mixin used for all Package types.
   * @param BasePackage - The parent BasePackage class being mixed
   * @returns - A BasePackage subclass mixed with ClientPackage features
   */
  function ClientPackageMixin<Package extends ConstructorOf<BasePackage<any, any>>>(
    BasePackage: Package
  ): Pick<Package, keyof Package> & {
    new (...args: ConstructorParameters<Package>): InstanceType<Package> & ClientPackage;
  };

  class Module extends ClientPackageMixin(foundry.packages.BaseModule) {
    constructor(
      data?: DataModel.SchemaToSourceInput<foundry.packages.BaseModule['schema']> & {
        /**
         * Is this package currently active?
         */
        active: boolean;
      },
      options?: DataModel.ConstructorOptions
    );

    /**
     * Is this package currently active?
     */
    readonly active: boolean;
  }

  class System extends ClientPackageMixin(foundry.packages.BaseSystem) {}

  class World extends ClientPackageMixin(foundry.packages.BaseWorld) {}

  const PACKAGE_TYPES: {
    world: World;
    system: System;
    module: Module;
  };
}

declare class ClientPackage {
  /**
   * Associate package availability with certain labels for client-side display.
   */
  getAvailabilityLabels(): { unavailable: string } | { incompatible: string } | Record<string, never>;

  /* ----------------------------------------- */

  /**
   * When a package has been installed, add it to the local game data.
   */
  install(): void;

  /* ----------------------------------------- */

  /**
   * When a package has been uninstalled, remove it from the local game data.
   */
  uninstall(): void;

  /* -------------------------------------------- */

  /**
   * Writes the Package migration back to disk. Meant for developers to be able to commit an updated manifest.
   */
  migrateManifest(): Promise<void>;
}
