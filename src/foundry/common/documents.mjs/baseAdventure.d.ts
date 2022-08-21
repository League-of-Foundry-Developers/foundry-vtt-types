import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";

type AdventureMetadata = Merge<
  DocumentMetadata,
  {
    name: "Adventure";
    collection: "adventures";
    label: "DOCUMENT.Adventure";
    labelPlural: "DOCUMENT.Adventures";
    isPrimary: false;
    isEmbedded: false;
  }
>;

/**
 * The base Adventure model definition which defines common behavior of an Adventure document between both client and server.
 *
 * WARNING: This document is an early prototype which will be fully implemented in V10.
 * Until then it is for internal use only. Use this at your own risk.
 * @internal
 */
export class BaseAdventure extends Document<data.AdventureData, null, AdventureMetadata> {
  static override get schema(): typeof data.AdventureData;

  static override get metadata(): AdventureMetadata;

  /**
   * A convenient reference to the file path of the Adventure's profile image.
   */
  get img(): string | null | undefined;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): string | null | undefined;
}
