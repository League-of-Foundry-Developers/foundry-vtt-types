import BasePackage from './base-package.mjs';
import BaseWorld from './base-world.mjs';
import BaseSystem from './base-system.mjs';
import BaseModule from './base-module.mjs';

export { default as BasePackage } from './base-package.mjs';
export { default as BaseWorld } from './base-world.mjs';
export { default as BaseSystem } from './base-system.mjs';
export { default as BaseModule } from './base-module.mjs';

/* ---------------------------------------- */
/*  Deprecations and Compatibility          */
/* ---------------------------------------- */

/**
 * @deprecated since v10
 */
export declare class PackageData extends BasePackage {}

/**
 * @deprecated since v10
 */
export class WorldData extends BaseWorld {}

/**
 * @deprecated since v10
 */
export class SystemData extends BaseSystem {}

/**
 * @deprecated since v10
 */
export class ModuleData extends BaseModule {}
