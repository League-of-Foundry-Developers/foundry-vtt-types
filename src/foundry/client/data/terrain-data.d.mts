import type DataModel from "#common/abstract/data.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The base TerrainData.
 * @remarks TODO: Stub
 */
declare abstract class BaseTerrainData<Schema extends DataSchema> extends DataModel<Schema> {}

declare namespace BaseTerrainData {}

/**
 * The core TerrainData implementation.
 */
declare class TerrainData<Schema extends TerrainData.Schema = TerrainData.Schema> extends BaseTerrainData<Schema> {}

declare namespace TerrainData {
  interface Schema extends DataSchema {}
}

export { BaseTerrainData, TerrainData };
