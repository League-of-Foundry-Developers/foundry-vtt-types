/**
 * An abstract class implementation for an EmbeddedEntity object within a parent Entity
 */
declare abstract class EmbeddedEntity<D extends EmbeddedEntity.Data = EmbeddedEntity.Data> {
  constructor(data: D, parent: Entity);

  /**
   * The embedded entity data object
   */
  data: D;

  /**
   * The parent Entity to which this belongs
   */
  parent: Entity;

  /* -------------------------------------------- */

  /**
   * A reference to the _id attribute of the EmbeddedEntity data
   */
  get id(): string;

  /* -------------------------------------------- */

  /**
   * Data preparation steps taken by the EmbeddedEntity instance when it's underlying data changes
   */
  prepareData(): void;

  /* -------------------------------------------- */

  /**
   * Get the value of a "flag" for this EmbeddedEntity
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag(scope: string, key: string): unknown;

  /* -------------------------------------------- */

  /**
   * Assign a "flag" to this EmbeddedEntity.
   * Flags represent key-value type data which can be used to store flexible or arbitrary data required by either
   * the core software, game systems, or user-created modules.
   *
   * Each flag should be set using a scope which provides a namespace for the flag to help prevent collisions.
   *
   * Flags set by the core software use the "core" scope.
   * Flags set by game systems or modules should use the canonical name attribute for the module
   * Flags set by an individual world should "world" as the scope.
   *
   * Flag values can assume almost any data type. Setting a flag value to null will delete that flag.
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @param value - The flag value
   *
   * @returns A Promise resolving to the updated EmbeddedEntity
   */
  setFlag(scope: string, key: string, value: any): Promise<this>;

  /* -------------------------------------------- */

  /**
   * Remove a flag assigned to the Entity
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns A Promise resolving to the updated Entity
   */
  unsetFlag(scope: string, key: string): Promise<this>;
}

declare namespace EmbeddedEntity {
  interface Data {
    _id: string;
    flags: Record<string, unknown>;
  }
}
