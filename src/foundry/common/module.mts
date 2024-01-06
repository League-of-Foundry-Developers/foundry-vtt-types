import * as _abstract from "./abstract/module.mts";
import * as _config from "./config.mjs/index.mts";
import * as _CONST from "./constants.mts";
import * as _data from "./data/module.mts";
import * as _documents from "./documents.mjs/index.mts";
import * as _packages from "./packages.mjs/index.mts";
import "./primitives/module.mts";
import "./types.mts";
import * as _utils from "./utils/module.mts";

/**
 * Constant definitions used throughout the Foundry Virtual Tabletop framework.
 */
export type * as CONST from "./constants.mts";

/**
 * Abstract class definitions providing fundamental interfaces used throughout the Foundry Virtual Tabletop framework.
 */
export type * as abstract from "./abstract/module.mts";

/**
 * Data schema definitions providing structure for Documents used throughout the Foundry Virtual Tabletop framework.
 */
export type * as data from "./data/module.mts";

/**
 * Document definitions used throughout the Foundry Virtual Tabletop framework.
 */
export type * as documents from "./documents.mjs/index.mts";

/**
 * Package data definitions, validations, and schema
 */
export type * as packages from "./packages.mjs/index.mts";

/**
 * Utility functions providing helpful functionality.
 */
export type * as utils from "./utils/module.mts";

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

  var benchmark: typeof _utils.benchmark; // eslint-disable-line no-var
  var debounce: typeof _utils.debounce; // eslint-disable-line no-var
  var deepClone: typeof _utils.deepClone; // eslint-disable-line no-var
  var diffObject: typeof _utils.diffObject; // eslint-disable-line no-var
  var duplicate: typeof _utils.duplicate; // eslint-disable-line no-var
  var encodeURL: typeof _utils.encodeURL; // eslint-disable-line no-var
  var expandObject: typeof _utils.expandObject; // eslint-disable-line no-var
  var filterObject: typeof _utils.filterObject; // eslint-disable-line no-var
  var flattenObject: typeof _utils.flattenObject; // eslint-disable-line no-var
  var getParentClasses: typeof _utils.getParentClasses; // eslint-disable-line no-var
  var getProperty: typeof _utils.getProperty; // eslint-disable-line no-var
  var getRoute: typeof _utils.getRoute; // eslint-disable-line no-var
  var getType: typeof _utils.getType; // eslint-disable-line no-var
  var hasProperty: typeof _utils.hasProperty; // eslint-disable-line no-var
  var invertObject: typeof _utils.invertObject; // eslint-disable-line no-var
  var isNewerVersion: typeof _utils.isNewerVersion; // eslint-disable-line no-var
  var isObjectEmpty: typeof _utils.isObjectEmpty; // eslint-disable-line no-var
  var mergeObject: typeof _utils.mergeObject; // eslint-disable-line no-var
  var randomID: typeof _utils.randomID; // eslint-disable-line no-var
  var setProperty: typeof _utils.setProperty; // eslint-disable-line no-var
  var timeSince: typeof _utils.timeSince; // eslint-disable-line no-var
  var rgbToHsv: typeof _utils.rgbToHsv; // eslint-disable-line no-var
  var hsvToRgb: typeof _utils.hsvToRgb; // eslint-disable-line no-var
  var rgbToHex: typeof _utils.rgbToHex; // eslint-disable-line no-var
  var hexToRGB: typeof _utils.hexToRGB; // eslint-disable-line no-var
  var hexToRGBAString: typeof _utils.hexToRGBAString; // eslint-disable-line no-var
  var colorStringToHex: typeof _utils.colorStringToHex; // eslint-disable-line no-var
}
