import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.ts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseScene } from "./baseScene.mts";

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
