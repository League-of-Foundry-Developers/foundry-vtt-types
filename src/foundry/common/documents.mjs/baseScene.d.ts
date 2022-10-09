import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import { BaseAmbientLight } from "./baseAmbientLight";
import { BaseAmbientSound } from "./baseAmbientSound";
import { BaseDrawing } from "./baseDrawing";
import { BaseMeasuredTemplate } from "./baseMeasuredTemplate";
import { BaseNote } from "./baseNote";
import { BaseTile } from "./baseTile";
import { BaseToken } from "./baseToken";
import { BaseWall } from "./baseWall";

type SceneMetadata = Merge<
  DocumentMetadata,
  {
    name: "Scene";
    collection: "scenes";
    label: "DOCUMENT.Scene";
    labelPlural: "DOCUMENT.Scenes";
    isPrimary: true;
    embedded: {
      AmbientLight: typeof BaseAmbientLight;
      AmbientSound: typeof BaseAmbientSound;
      Drawing: typeof BaseDrawing;
      MeasuredTemplate: typeof BaseMeasuredTemplate;
      Note: typeof BaseNote;
      Tile: typeof BaseTile;
      Token: typeof BaseToken;
      Wall: typeof BaseWall;
    };
  }
>;

/**
 * The base Scene model definition which defines common behavior of an Scene document between both client and server.
 */
export declare class BaseScene extends Document<data.SceneData, null, SceneMetadata> {
  static override get schema(): typeof data.SceneData;

  static override get metadata(): SceneMetadata;

  /**
   * A reference to the Collection of Drawing instances in the Scene document, indexed by _id.
   */
  get drawings(): this["data"]["drawings"];

  /**
   * A reference to the Collection of AmbientLight instances in the Scene document, indexed by _id.
   */
  get lights(): this["data"]["lights"];

  /**
   * A reference to the Collection of Note instances in the Scene document, indexed by _id.
   */
  get notes(): this["data"]["notes"];

  /**
   * A reference to the Collection of AmbientSound instances in the Scene document, indexed by _id.
   */
  get sounds(): this["data"]["sounds"];

  /**
   * A reference to the Collection of MeasuredTemplate instances in the Scene document, indexed by _id.
   */
  get templates(): this["data"]["templates"];

  /**
   * A reference to the Collection of Token instances in the Scene document, indexed by _id.
   */
  get tokens(): this["data"]["tokens"];

  /**
   * A reference to the Collection of Tile instances in the Scene document, indexed by _id.
   */
  get tiles(): this["data"]["tiles"];

  /**
   * A reference to the Collection of Wall instances in the Scene document, indexed by _id.
   */
  get walls(): this["data"]["walls"];

  /**
   * Get the Canvas dimensions which would be used to display this Scene.
   * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
   * @returns An object describing the configured dimensions
   */
  static getDimensions({
    width,
    height,
    size,
    gridDistance,
    padding,
    shiftX,
    shiftY
  }?: Partial<DimensionsArguments>): Dimensions;
}

interface DimensionsArguments {
  width: number;
  height: number;
  size: number;
  gridDistance: number;
  padding: number;
  shiftX: number;
  shiftY: number;
}

interface Dimensions {
  sceneWidth: number;
  sceneHeight: number;
  size: number;
  distance: number;
  shiftX: number;
  shiftY: number;
  ratio: number;
  paddingX: number;
  width: number;
  paddingY: number;
  height: number;
}
