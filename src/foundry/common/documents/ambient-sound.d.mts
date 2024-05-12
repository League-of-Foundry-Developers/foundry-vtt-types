import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { BaseScene } from "./scene.d.mts";

type AmbientSoundMetadata = Merge<
  DocumentMetadata,
  {
    name: "AmbientSound";
    collection: "sounds";
    label: "DOCUMENT.AmbientSound";
    labelPlural: "DOCUMENT.AmbientSounds";
    isEmbedded: true;
  }
>;

/**
 * The base AmbientSound model definition which defines common behavior of an AmbientSound document between both client and server.
 */
export declare class BaseAmbientSound extends Document<
  data.AmbientSoundData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  AmbientSoundMetadata
> {
  static override get schema(): typeof data.AmbientSoundData;

  static override get metadata(): AmbientSoundMetadata;
}
