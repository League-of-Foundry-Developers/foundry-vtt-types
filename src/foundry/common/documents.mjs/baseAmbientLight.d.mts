import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { BaseScene } from "./baseScene.d.mts";

type AmbientLightMetadata = Merge<
  DocumentMetadata,
  {
    name: "AmbientLight";
    collection: "lights";
    label: "DOCUMENT.AmbientLight";
    labelPlural: "DOCUMENT.AmbientLights";
    isEmbedded: true;
  }
>;

/**
 * The base AmbientLight model definition which defines common behavior of an AmbientLight document between both client and server.
 */
export declare class BaseAmbientLight extends Document<
  data.AmbientLightData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  AmbientLightMetadata
> {
  static override get schema(): typeof data.AmbientLightData;

  static override get metadata(): AmbientLightMetadata;

  protected override _initialize(): void;
}
