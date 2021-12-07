import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes.js';
import { DocumentData } from '../../abstract/module.mjs';
import { documents } from '../../module.mjs';
import * as fields from '../fields.mjs';

interface TileOcclusionSchema extends DocumentSchema {
  mode: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.TILE_OCCLUSION_MODES.FADE;
      validate: (m: unknown) => m is foundry.CONST.TILE_OCCLUSION_MODES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.TILE_OCCLUSION_MODES';
    }
  >;
  alpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
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

export interface TileOcclusionConstructorData {
  /**
   * The occlusion mode from CONST.TILE_OCCLUSION_MODES
   * @defaultValue `CONST.TILE_OCCLUSION_MODES.FADE`
   */
  mode?: foundry.CONST.TILE_OCCLUSION_MODES | null;

  /**
   * The occlusion alpha between 0 and 1
   * @defaultValue `0`
   */
  alpha?: number | null;
}

/**
 * An inner-object which defines the schema for how Tile occlusion settings are defined
 */
export declare class TileOcclusion extends DocumentData<
  TileOcclusionSchema,
  TileOcclusionProperties,
  PropertiesToSource<TileOcclusionProperties>,
  TileOcclusionConstructorData,
  documents.BaseTile
> {
  static defineSchema(): TileOcclusionSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TileOcclusion extends TileOcclusionProperties {}
