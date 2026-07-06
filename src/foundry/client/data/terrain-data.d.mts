import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";
import type { FixedInstanceType, Identity } from "#utils";

/**
 * The base TerrainData.
 */
declare abstract class BaseTerrainData<Schema extends fields.DataSchema> extends DataModel<Schema> {
  /**
   * Create the terrain data from the given array of terrain effects.
   * The type of the terrain effects and data is system-defined.
   * The terrain effects are not passed in any particular order.
   * Ownership of the array is passed to this function.
   * This function must return null if the array of terrain effects is empty.
   * @param effects - An array of terrain effects
   * @returns The terrain data or null
   * @abstract
   * @remarks Unconditionally throws in {@linkcode BaseTerrainData}.
   */
  static resolveTerrainEffects(effects: BaseTerrainData.TerrainEffect[]): BaseTerrainData.Internal.Any | null;

  /**
   * Create the terrain movement cost function for the given token.
   * Only movement cost that is caused by the terrain should be calculated by this function,
   * which includes the base movement cost.
   * Extra movement cost unrelated to terrain must be calculated in
   * {@linkcode foundry.canvas.placeables.Token._getMovementCostFunction | Token#_getMovementCostFunction}.
   * In square and hexagonal grids it calculates the cost for single grid space move between two grid space offsets.
   * For tokens that occupy more than one grid space the cost of movement is calculated as the median of all individual
   * grid space moves unless the cost of any of these is infinite, in which case total cost is always infinite.
   * In gridless grids the `from` and `to` parameters of the cost function are top-left offsets.
   * If the movement cost function is undefined, the cost equals the distance moved.
   * @param token   - The Token that moves
   * @param options - Additional options that affect cost calculations
   * @abstract
   * @remarks Unconditionally throws in {@linkcode BaseTerrainData}.
   */
  static getMovementCostFunction(
    token: TokenDocument.Implementation,
    options?: TokenDocument.MeasureMovementPathOptions,
  ): TokenDocument.MovementCostFunction | void;

  /**
   * Is this terrain data the same as some other terrain data?
   * @param other - Some other terrain data
   * @returns Are the terrain datas equal?
   */
  abstract equals(other: BaseTerrainData.Implementation): boolean;
}

declare namespace BaseTerrainData {
  interface ImplementationClass extends Identity<typeof CONFIG.Token.movement.TerrainData> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  namespace Internal {
    /** This only exists to be the return of {@linkcode BaseTerrainData.resolveTerrainEffects}. */
    interface Any extends AnyBaseTerrainData {}

    /** This only exists to be the constraint for {@linkcode CONFIG.Token.movement.TerrainData} */
    interface AnyConstructor extends Identity<typeof AnyBaseTerrainData> {}
  }

  // TODO: Figure out if this is actually typeable beyond this, or if it just need to be defined in the subclass
  type TerrainEffect = object;
}

/**
 * The core TerrainData implementation.
 */
declare class TerrainData<Schema extends TerrainData.Schema = TerrainData.Schema> extends BaseTerrainData<Schema> {
  static override defineSchema(): TerrainData.Schema;

  static override resolveTerrainEffects(effects: TerrainData.TerrainEffect[]): TerrainData | null;

  static override getMovementCostFunction(
    token: TokenDocument.Implementation,
    options?: TokenDocument.MeasureMovementPathOptions,
  ): TokenDocument.MovementCostFunction | void;

  override _initialize(options: DataModel.InitializeOptions): void;

  override equals(other: BaseTerrainData.Implementation): boolean;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<TerrainData.Schema>;

  static override get schema(): fields.SchemaField<TerrainData.Schema>;

  static override validateJoint(data: TerrainData.Source): void;

  static override fromSource(source: TerrainData.CreateData, context?: DataModel.FromSourceOptions): TerrainData;

  static override fromJSON(json: string): TerrainData;
}

declare namespace TerrainData {
  export import Implementation = BaseTerrainData.Implementation;
  export import ImplementationClass = BaseTerrainData.ImplementationClass;

  interface Schema extends fields.DataSchema {
    difficulty: fields.NumberField<{ required: true; nullable: true; min: 0; initial: 1 }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * @privateRemarks This is accurate for the one core-provided class. It might need to be widened upon further input from users.
   */
  interface TerrainEffect extends InitializedData {
    name: "difficulty";
  }
}

export { BaseTerrainData, TerrainData };

declare abstract class AnyBaseTerrainData extends BaseTerrainData<fields.DataSchema> {
  constructor(...args: never);
}
