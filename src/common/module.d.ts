import './types';
import './utils/primitives';
import * as _CONST from './constants';
import * as _abstract from './abstract/module';
import * as _data from './data/module';
import * as _documents from './documents';
import * as _utils from './utils/module';

declare global {
  namespace foundry {
    export import CONST = _CONST; // eslint-disable-line @typescript-eslint/no-unused-vars
    export import abstract = _abstract; // eslint-disable-line @typescript-eslint/no-unused-vars
    export import data = _data; // eslint-disable-line @typescript-eslint/no-unused-vars
    export import utils = _utils; // eslint-disable-line @typescript-eslint/no-unused-vars
    export import documents = _documents; // eslint-disable-line @typescript-eslint/no-unused-vars
  }

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
