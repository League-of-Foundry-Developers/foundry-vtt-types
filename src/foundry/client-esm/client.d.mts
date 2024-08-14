// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */

import "../common/primitives/module.mjs";
import * as _CONST from "../common/constants.mjs";
import * as _abstract from "../common/abstract/module.mjs";
import * as _documents from "../common/documents/_module.mjs";
import * as _packages from "../common/packages/module.mjs";
import * as _utils from "../common/utils/module.mjs";
import * as _config from "../common/config.mjs";
import * as _prosemirror from "../common/prosemirror/_module.mjs";
// import * as _grid from "../common/grid/_module.mjs";
// import * as _types from "../common/types.mjs";

// client
import * as _applications from "./applications/_module.mjs";
import * as _audio from "./audio/_module.mjs";
import * as _canvas from "./canvas/_module.mjs";
import * as _helpers from "./helpers/_module.mjs";
import * as _data from "./data/_module.mjs";
import * as _dice from "./dice/_module.mjs";
import type { AnyObject } from "../../types/utils.d.mts";

/**
 * Constant definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as CONST from "../common/constants.mjs";

/**
 * Abstract class definitions for fundamental concepts used throughout the Foundry Virtual Tabletop framework.
 */
export * as abstract from "../common/abstract/module.mjs";

/**
 * Application configuration options
 */
export * as config from "../common/config.mjs";

/**
 * Document definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as documents from "../common/documents/_module.mjs";

/**
 * Package data definitions, validations, and schema.
 */
export * as packages from "../common/packages/module.mjs";

/**
 * Utility functions providing helpful functionality.
 */
export * as utils from "../common/utils/module.mjs";

/**
 * A library for providing rich text editing using ProseMirror within the Foundry Virtual Tabletop game client.
 */
// export * as prosemirror from "../common/prosemirror/_module.mjs";

/**
 * Grid classes.
 */
// export * as grid from "../common/grid/_module.mjs";

/**
 * A library for rendering and managing HTML user interface elements within the Foundry Virtual Tabletop game client.
 */
export * as applications from "./applications/_module.mjs";

/**
 * A library for controlling audio playback within the Foundry Virtual Tabletop game client.
 */
export * as audio from "./audio/_module.mjs";

/**
 * A submodule defining concepts related to canvas rendering.
 */
export * as canvas from "./canvas/_module.mjs";

/**
 * A submodule containing core helper classes.
 */
export * as helpers from "./helpers/_module.mjs";

/**
 * A module which defines data architecture components.
 */
export * as data from "./data/_module.mjs";

/**
 * A module for parsing and executing dice roll syntax.
 */
export * as dice from "./dice/_module.mjs";

/**
 * Shared importable types.
 */
export * as types from "../common/types.mjs";

declare global {
  namespace foundry {
    /**
     * Constant definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import CONST = _CONST;

    /**
     * Abstract class definitions for fundamental concepts used throughout the Foundry Virtual Tabletop framework.
     */
    export import abstract = _abstract;

    /**
     * Application configuration options
     */
    export import config = _config;

    /**
     * Document definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import documents = _documents;

    /**
     * Package data definitions, validations, and schema.
     */
    export import packages = _packages;

    /**
     * Utility functions providing helpful functionality.
     */
    export import utils = _utils;

    /**
     * A library for providing rich text editing using ProseMirror within the Foundry Virtual Tabletop game client.
     */
    export import prosemirror = _prosemirror;

    /**
     * Grid classes.
     */
    // export import grid = _grid;

    /**
     * A library for rendering and managing HTML user interface elements within the Foundry Virtual Tabletop game client.
     */
    export import applications = _applications;

    /**
     * A library for controlling audio playback within the Foundry Virtual Tabletop game client.
     */
    export import audio = _audio;

    /**
     * A submodule defining concepts related to canvas rendering.
     */
    export import canvas = _canvas;

    /**
     * A submodule containing core helper classes.
     */
    export import helpers = _helpers;

    /**
     * A module which defines data architecture components.
     */
    export import data = _data;

    /**
     * A module for parsing and executing dice roll syntax.
     */
    export import dice = _dice;

    /**
     * Shared importable types.
     */
    // export import types = _types;
  }
  /**
   * Constant definitions used throughout the Foundry Virtual Tabletop framework.
   */
  const CONST: typeof _CONST;

  // Color is currently handled in src/foundry/client/head.d.mts

  type Collection<T> = _utils.Collection<T>;
  var Collection: typeof _utils.Collection; // eslint-disable-line no-var

  type Roll<D extends Record<string, unknown> = AnyObject> = _dice.Roll<D>;
  var Roll: typeof _dice.Roll; // eslint-disable-line no-var

  // Deprecated global namespace dump; done programmatically by fvtt
  type Semaphore = _utils.Semaphore;
  /** @deprecated since v12 will be removed in v14 */
  var Semaphore: typeof _utils.Semaphore; // eslint-disable-line no-var

  type IterableWeakMap<K extends WeakKey, V> = _utils.IterableWeakMap<K, V>;
  /** @deprecated since v12 will be removed in v14 */
  var IterableWeakMap: typeof _utils.IterableWeakMap; // eslint-disable-line no-var

  type IterableWeakSet<T extends WeakKey> = _utils.IterableWeakSet<T>;
  /** @deprecated since v12 will be removed in v14 */
  var IterableWeakSet: typeof _utils.IterableWeakSet; // eslint-disable-line no-var

  /* eslint-disable no-var */
  /* --- geometry --- */
  /** @deprecated since v12 will be removed in v14 */
  var orient2dFast: typeof _utils.orient2dFast;
  /** @deprecated since v12 will be removed in v14 */
  var lineSegmentIntersects: typeof _utils.lineSegmentIntersects;
  /** @deprecated since v12 will be removed in v14 */
  var lineLineIntersection: typeof _utils.lineLineIntersection;
  /** @deprecated since v12 will be removed in v14 */
  var lineSegmentIntersection: typeof _utils.lineSegmentIntersection;
  /** @deprecated since v12 will be removed in v14 */
  var lineCircleIntersection: typeof _utils.lineCircleIntersection;
  /** @deprecated since v12 will be removed in v14 */
  var closestPointToSegment: typeof _utils.closestPointToSegment;
  /** @deprecated since v12 will be removed in v14 */
  var quadraticIntersection: typeof _utils.quadraticIntersection;

  /* --- helpers --- */
  /** @deprecated since v12 will be removed in v14 */
  var benchmark: typeof _utils.benchmark;
  /** @deprecated since v12 will be removed in v14 */
  var threadLock: typeof _utils.threadLock;
  /** @deprecated since v12 will be removed in v14 */
  var debounce: typeof _utils.debounce;
  /** @deprecated since v12 will be removed in v14 */
  var debouncedReload: typeof _utils.debouncedReload;
  /** @deprecated since v12 will be removed in v14 */
  var deepClone: typeof _utils.deepClone;
  /** @deprecated since v12 will be removed in v14 */
  var diffObject: typeof _utils.diffObject;
  /** @deprecated since v12 will be removed in v14 */
  var objectsEqual: typeof _utils.objectsEqual;
  /** @deprecated since v12 will be removed in v14 */
  var duplicate: typeof _utils.duplicate;
  /** @deprecated since v12 will be removed in v14 */
  var isSubclass: typeof _utils.isSubclass;
  /** @deprecated since v12 will be removed in v14 */
  var getDefiningClass: typeof _utils.getDefiningClass;
  /** @deprecated since v12 will be removed in v14 */
  var encodeURL: typeof _utils.encodeURL;
  /** @deprecated since v12 will be removed in v14 */
  var expandObject: typeof _utils.expandObject;
  /** @deprecated since v12 will be removed in v14 */
  var filterObject: typeof _utils.filterObject;
  /** @deprecated since v12 will be removed in v14 */
  var flattenObject: typeof _utils.flattenObject;
  /** @deprecated since v12 will be removed in v14 */
  var getParentClasses: typeof _utils.getParentClasses;
  /** @deprecated since v12 will be removed in v14 */
  var getRoute: typeof _utils.getRoute;
  /** @deprecated since v12 will be removed in v14 */
  var getType: typeof _utils.getType;
  /** @deprecated since v12 will be removed in v14 */
  var hasProperty: typeof _utils.hasProperty;
  /** @deprecated since v12 will be removed in v14 */
  var getProperty: typeof _utils.getProperty;
  /** @deprecated since v12 will be removed in v14 */
  var setProperty: typeof _utils.setProperty;
  /** @deprecated since v12 will be removed in v14 */
  var invertObject: typeof _utils.invertObject;
  /** @deprecated since v12 will be removed in v14 */
  var isEmpty: typeof _utils.isEmpty;
  /** @deprecated since v12 will be removed in v14 */
  var mergeObject: typeof _utils.mergeObject;
  /** @deprecated since v12 will be removed in v14 */
  var parseS3URL: typeof _utils.parseS3URL;
  /** @deprecated since v12 will be removed in v14 */
  var randomID: typeof _utils.randomID;
  /** @deprecated since v12 will be removed in v14 */
  var timeSince: typeof _utils.timeSince;
  /** @deprecated since v12 will be removed in v14 */
  var formatFileSize: typeof _utils.formatFileSize;
  /** @deprecated since v12 will be removed in v14 */
  var parseUuid: typeof _utils.parseUuid;

  /* --- http --- */

  /** @deprecated since v12 will be removed in v14 */
  var fetchWithTimeout: typeof _utils.fetchWithTimeout;
  /** @deprecated since v12 will be removed in v14 */
  var fetchJsonWithTimeout: typeof _utils.fetchJsonWithTimeout;

  /* --- logging --- */

  /** @deprecated since v12 will be removed in v14 */
  var logCompatibilityWarning: typeof _utils.logCompatibilityWarning;
  /* eslint-enable no-var */
}
