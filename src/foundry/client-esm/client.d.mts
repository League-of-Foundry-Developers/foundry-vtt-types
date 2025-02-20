// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import "../common/primitives/module.mjs";
import * as _CONST from "../common/constants.mjs";
import * as _abstract from "../common/abstract/module.mjs";
import * as _documents from "../common/documents/_module.mjs";
import * as _packages from "../common/packages/module.mjs";
import * as _utils from "../common/utils/module.mjs";
import * as _config from "../common/config.mjs";
import * as _prosemirror from "../common/prosemirror/_module.mjs";
import * as _grid from "../common/grid/_module.mjs";
// import * as _types from "../common/types.mjs";

// client
import * as _applications from "./applications/_module.mjs";
import * as _audio from "./audio/_module.mjs";
import * as _canvas from "./canvas/_module.mjs";
import * as _helpers from "./helpers/_module.mjs";
import * as _data from "./data/_module.mjs";
import * as _dice from "./dice/_module.mjs";

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
export * as prosemirror from "../common/prosemirror/_module.mjs";

/**
 * Grid classes.
 */
export * as grid from "../common/grid/_module.mjs";

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
    export import grid = _grid;

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
  }

  /**
   * Constant definitions used throughout the Foundry Virtual Tabletop framework.
   */
  export import CONST = _CONST;

  // Color is currently handled in src/foundry/client/head.d.mts

  export import Collection = _utils.Collection;

  export import Roll = _dice.Roll;

  // Deprecated global namespace dump; done programmatically by fvtt
  /** @deprecated since v12 will be removed in v14 */
  export import Semaphore = _utils.Semaphore;

  /** @deprecated since v12 will be removed in v14 */
  export import IterableWeakMap = _utils.IterableWeakMap;

  /** @deprecated since v12 will be removed in v14 */
  export import IterableWeakSet = _utils.IterableWeakSet;

  /* --- geometry --- */
  /** @deprecated since v12 will be removed in v14 */
  export import orient2dFast = _utils.orient2dFast;
  /** @deprecated since v12 will be removed in v14 */
  export import lineSegmentIntersects = _utils.lineSegmentIntersects;
  /** @deprecated since v12 will be removed in v14 */
  export import lineLineIntersection = _utils.lineLineIntersection;
  /** @deprecated since v12 will be removed in v14 */
  export import lineSegmentIntersection = _utils.lineSegmentIntersection;
  /** @deprecated since v12 will be removed in v14 */
  export import lineCircleIntersection = _utils.lineCircleIntersection;
  /** @deprecated since v12 will be removed in v14 */
  export import closestPointToSegment = _utils.closestPointToSegment;
  /** @deprecated since v12 will be removed in v14 */
  export import quadraticIntersection = _utils.quadraticIntersection;

  /* --- helpers --- */
  /** @deprecated since v12 will be removed in v14 */
  export import benchmark = _utils.benchmark;
  /** @deprecated since v12 will be removed in v14 */
  export import threadLock = _utils.threadLock;
  /** @deprecated since v12 will be removed in v14 */
  export import debounce = _utils.debounce;
  /** @deprecated since v12 will be removed in v14 */
  export import debouncedReload = _utils.debouncedReload;
  /** @deprecated since v12 will be removed in v14 */
  export import deepClone = _utils.deepClone;
  /** @deprecated since v12 will be removed in v14 */
  export import diffObject = _utils.diffObject;
  /** @deprecated since v12 will be removed in v14 */
  export import objectsEqual = _utils.objectsEqual;
  /** @deprecated since v12 will be removed in v14 */
  export import duplicate = _utils.duplicate;
  /** @deprecated since v12 will be removed in v14 */
  export import isSubclass = _utils.isSubclass;
  /** @deprecated since v12 will be removed in v14 */
  export import getDefiningClass = _utils.getDefiningClass;
  /** @deprecated since v12 will be removed in v14 */
  export import encodeURL = _utils.encodeURL;
  /** @deprecated since v12 will be removed in v14 */
  export import expandObject = _utils.expandObject;
  /** @deprecated since v12 will be removed in v14 */
  export import filterObject = _utils.filterObject;
  /** @deprecated since v12 will be removed in v14 */
  export import flattenObject = _utils.flattenObject;
  /** @deprecated since v12 will be removed in v14 */
  export import getParentClasses = _utils.getParentClasses;
  /** @deprecated since v12 will be removed in v14 */
  export import getRoute = _utils.getRoute;
  /** @deprecated since v12 will be removed in v14 */
  export import getType = _utils.getType;
  /** @deprecated since v12 will be removed in v14 */
  export import hasProperty = _utils.hasProperty;
  /** @deprecated since v12 will be removed in v14 */
  export import getProperty = _utils.getProperty;
  /** @deprecated since v12 will be removed in v14 */
  export import setProperty = _utils.setProperty;
  /** @deprecated since v12 will be removed in v14 */
  export import invertObject = _utils.invertObject;
  /** @deprecated since v12 will be removed in v14 */
  export import isEmpty = _utils.isEmpty;
  /** @deprecated since v12 will be removed in v14 */
  export import mergeObject = _utils.mergeObject;
  /** @deprecated since v12 will be removed in v14 */
  export import parseS3URL = _utils.parseS3URL;
  /** @deprecated since v12 will be removed in v14 */
  export import randomID = _utils.randomID;
  /** @deprecated since v12 will be removed in v14 */
  export import timeSince = _utils.timeSince;
  /** @deprecated since v12 will be removed in v14 */
  export import formatFileSize = _utils.formatFileSize;
  /** @deprecated since v12 will be removed in v14 */
  export import parseUuid = _utils.parseUuid;

  /* --- http --- */

  /** @deprecated since v12 will be removed in v14 */
  export import fetchWithTimeout = _utils.fetchWithTimeout;
  /** @deprecated since v12 will be removed in v14 */
  export import fetchJsonWithTimeout = _utils.fetchJsonWithTimeout;

  /* --- logging --- */

  /** @deprecated since v12 will be removed in v14 */
  export import logCompatibilityWarning = _utils.logCompatibilityWarning;
}
