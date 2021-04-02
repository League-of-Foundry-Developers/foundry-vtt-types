import './abstract/module';
import './constants';
import './data/module';
import './documents';
import './types';
import './utils/module';

declare const CONST: typeof foundry.CONST;

type Collection<T> = foundry.utils.Collection<T>;
declare var Collection: typeof foundry.utils.Collection; // eslint-disable-line no-var

type Semaphore = foundry.utils.Semaphore;
declare var Semaphore: typeof foundry.utils.Semaphore; // eslint-disable-line no-var

// TODO: Make all helpers available globally.
