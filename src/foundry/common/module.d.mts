// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */

import * as _abstract from "./abstract/module.mjs";
import * as _config from "./config.mjs";
import * as _CONST from "./constants.mjs";
import * as _data from "./data/module.mjs";
import * as _documents from "./documents/module.mjs";
import * as _packages from "./packages/module.mjs";
import "./primitives/module.d.mts";
import "./types.d.mts";
import * as _utils from "./utils/module.mjs";

/**
 * Constant definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as CONST from "./constants.mjs";

/**
 * Abstract class definitions providing fundamental interfaces used throughout the Foundry Virtual Tabletop framework.
 */
export * as abstract from "./abstract/module.mjs";

/**
 * Data schema definitions providing structure for Documents used throughout the Foundry Virtual Tabletop framework.
 */
export * as data from "./data/module.mjs";

/**
 * Document definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as documents from "./documents/module.mjs";

/**
 * Package data definitions, validations, and schema
 */
export * as packages from "./packages/module.mjs";

/**
 * Utility functions providing helpful functionality.
 */
export * as utils from "./utils/module.mjs";

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

  // Color is currently handled in src/foundry/client/head.d.mts

  type Collection<T> = _utils.Collection<T>;
  var Collection: typeof _utils.Collection; // eslint-disable-line no-var

  // Sorta deprecated global namespace dump; done programatically by fvtt
  // will begin proper deprecation process in v12
  type Semaphore = _utils.Semaphore;
  var Semaphore: typeof _utils.Semaphore; // eslint-disable-line no-var

  type IterableWeakMap<K extends WeakKey, V> = _utils.IterableWeakMap<K, V>;
  var IterableWeakMap: typeof _utils.IterableWeakMap; // eslint-disable-line no-var

  type IterableWeakSet<T extends WeakKey> = _utils.IterableWeakSet<T>;
  var IterableWeakSet: typeof _utils.IterableWeakSet; // eslint-disable-line no-var

  /* eslint-disable no-var */
  /* --- geometry --- */
  var orient2dFast: typeof _utils.orient2dFast;
  var lineSegmentIntersects: typeof _utils.lineSegmentIntersects;
  var lineLineIntersection: typeof _utils.lineLineIntersection;
  var lineSegmentIntersection: typeof _utils.lineSegmentIntersection;
  var lineCircleIntersection: typeof _utils.lineCircleIntersection;
  var closestPointToSegment: typeof _utils.closestPointToSegment;
  var quadraticIntersection: typeof _utils.quadraticIntersection;

  /* --- helpers --- */
  var benchmark: typeof _utils.benchmark;
  var threadLock: typeof _utils.threadLock;
  var debounce: typeof _utils.debounce;
  var debouncedReload: typeof _utils.debouncedReload;
  var deepClone: typeof _utils.deepClone;
  var diffObject: typeof _utils.diffObject;
  var objectsEqual: typeof _utils.objectsEqual;
  var duplicate: typeof _utils.duplicate;
  var isSubclass: typeof _utils.isSubclass;
  var getDefiningClass: typeof _utils.getDefiningClass;
  var encodeURL: typeof _utils.encodeURL;
  var expandObject: typeof _utils.expandObject;
  var filterObject: typeof _utils.filterObject;
  var flattenObject: typeof _utils.flattenObject;
  var getParentClasses: typeof _utils.getParentClasses;
  var getRoute: typeof _utils.getRoute;
  var getType: typeof _utils.getType;
  var hasProperty: typeof _utils.hasProperty;
  var getProperty: typeof _utils.getProperty;
  var setProperty: typeof _utils.setProperty;
  var invertObject: typeof _utils.invertObject;
  var isObjectEmpty: typeof _utils.isObjectEmpty;
  var isEmpty: typeof _utils.isEmpty;
  var mergeObject: typeof _utils.mergeObject;
  var parseS3URL: typeof _utils.parseS3URL;
  var randomID: typeof _utils.randomID;
  var timeSince: typeof _utils.timeSince;
  var formatFileSize: typeof _utils.formatFileSize;
  var parseUuid: typeof _utils.parseUuid;

  /* --- http --- */

  var fetchWithTimeout: typeof _utils.fetchWithTimeout;
  var fetchJsonWithTimeout: typeof _utils.fetchJsonWithTimeout;

  /* --- logging --- */

  var logCompatibilityWarning: typeof _utils.logCompatibilityWarning;
  /* eslint-enable no-var */
}
