import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { documents } from "../../module.mjs";
import * as fields from "../fields.mjs";

interface TileOcclusionSchema extends DocumentSchema {
  mode: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.TILE_OCCLUSION_MODES.FADE;
      validate: (m: unknown) => m is foundry.CONST.TILE_OCCLUSION_MODES;
      validationError: "Invalid {name} {field} which must be a value in CONST.TILE_OCCLUSION_MODES";
    }
  >;
  alpha: FieldReturnType<fields.AlphaField, { default: 0 }>;
}

interface TileOcclusionProperties {
  /**
   * The occlusion mode from CONST.TILE_OCCLUSION_MODES
   * @defaultValue `CONST.TILE_OCCLUSION_MODES.FADE`
   */
  mode: foundry.CONST.TILE_OCCLUSION_MODES;

  /**
   * The occlusion alpha between 0 and 1
   * @defaultValue `0`
   */
  alpha: number;
}

interface TileOcclusionConstructorData {
  /**
   * The occlusion mode from CONST.TILE_OCCLUSION_MODES
   * @defaultValue `CONST.TILE_OCCLUSION_MODES.FADE`
   */
  mode?: foundry.CONST.TILE_OCCLUSION_MODES | null | undefined;

  /**
   * The occlusion alpha between 0 and 1
   * @defaultValue `0`
   */
  alpha?: number | null | undefined;
}

type TileOcclusionSource = PropertiesToSource<TileOcclusionProperties>;

/**
 * An inner-object which defines the schema for how Tile occlusion settings are defined
 */
export class TileOcclusion extends DocumentData<
  TileOcclusionSchema,
  TileOcclusionProperties,
  TileOcclusionSource,
  TileOcclusionConstructorData,
  documents.BaseTile
> {
  static override defineSchema(): TileOcclusionSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TileOcclusion extends TileOcclusionProperties {}
