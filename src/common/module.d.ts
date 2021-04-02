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

  // TODO: Add all helpers to global scope
}
