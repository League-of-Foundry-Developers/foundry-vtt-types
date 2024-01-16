import * as _abstract from "./abstract/module.mts";
import * as _config from "./config.mjs/index.mts";
import * as _CONST from "./constants.mts";
import * as _data from "./data/module.mts";
import * as _documents from "./documents.mjs/index.mts";
import * as _packages from "./packages.mjs/index.mts";
import "./primitives/module.d.mts";
import "./types.d.mts";
import * as _utils from "./utils/module.mts";

/**
 * Constant definitions used throughout the Foundry Virtual Tabletop framework.
 */
export type * as CONST from "./constants.d.mts";

/**
 * Abstract class definitions providing fundamental interfaces used throughout the Foundry Virtual Tabletop framework.
 */
export type * as abstract from "./abstract/module.d.mts";

/**
 * Data schema definitions providing structure for Documents used throughout the Foundry Virtual Tabletop framework.
 */
export type * as data from "./data/module.d.mts";

/**
 * Document definitions used throughout the Foundry Virtual Tabletop framework.
 */
export type * as documents from "./documents.mjs/index.d.mts";

/**
 * Package data definitions, validations, and schema
 */
export type * as packages from "./packages.mjs/index.d.mts";

/**
 * Utility functions providing helpful functionality.
 */
export type * as utils from "./utils/module.d.mts";

declare global {
  namespace foundry {
    /**
     * Constant definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import CONST = _CONST; // eslint-disable-line @typescript-eslint/no-unused-vars

    /**
     * Abstract class definitions providing fundamental interfaces used throughout the Foundry Virtual Tabletop framework.
     */
    export import abstract = _abstract; // eslint-disable-line @typescript-eslint/no-unused-vars

    /**
     * Data schema definitions providing structure for Documents used throughout the Foundry Virtual Tabletop framework.
     */
    export import data = _data; // eslint-disable-line @typescript-eslint/no-unused-vars

    /**
     * Utility functions providing helpful functionality.
     */
    export import utils = _utils; // eslint-disable-line @typescript-eslint/no-unused-vars

    /**
     * Document definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import documents = _documents; // eslint-disable-line @typescript-eslint/no-unused-vars

    /**
     * Package data definitions, validations, and schema
     */
    export import packages = _packages; // eslint-disable-line @typescript-eslint/no-unused-vars

    export import config = _config; // eslint-disable-line @typescript-eslint/no-unused-vars
  }

  /**
   * Constant definitions used throughout the Foundry Virtual Tabletop framework.
   */
  const CONST: typeof _CONST;

  type Collection<T> = _utils.Collection<T>;
  var Collection: typeof _utils.Collection; // eslint-disable-line no-var

  type Semaphore = _utils.Semaphore;
  var Semaphore: typeof _utils.Semaphore; // eslint-disable-line no-var
}
