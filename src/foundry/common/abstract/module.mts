// FOUNDRY_VERSION: 10.291

import type DataModel from "./data.mts";

export { default as DatabaseBackend } from "./backend.mts";
export * from "./data.mts";
export { default as Document } from "./document.mts";
export { default as EmbeddedCollection } from "./embedded-collection.mts";

/**
 * @deprecated since v10 and has been renamed to DataModel.
 */
export declare class DocumentData extends DataModel<any, any> {
  /** @deprecated since v10 and has been renamed to DataModel. */
  constructor(...args: any[]);
}
