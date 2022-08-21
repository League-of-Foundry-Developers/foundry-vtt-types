import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import { BaseScene } from "./baseScene";

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
