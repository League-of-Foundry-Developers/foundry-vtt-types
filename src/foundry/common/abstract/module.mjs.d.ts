// FOUNDRY_VERSION: 10.291

import type DataModel from "./data.mjs";

export * from "./data.mjs";
export { default as Document } from "./document.mjs";
export { default as DatabaseBackend } from "./backend.mjs";
export { default as EmbeddedCollection } from "./embedded-collection.mjs";

/**
 * @deprecated since v10 and has been renamed to DataModel.
 */
export declare class DocumentData extends DataModel<any, any> {
  /** @deprecated since v10 and has been renamed to DataModel. */
  constructor(...args: any[]);
}
