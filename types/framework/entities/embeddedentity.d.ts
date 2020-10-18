declare abstract class EmbeddedEntity {
	constructor(data: any, parent: Entity);

	/**
	 * The embedded entity data object
	 */
	data: any;

	/**
	 * The parent Entity to which this belongs
	 */
	parent: Entity;

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
	 * @param {string} scope    The flag scope which namespaces the key
	 * @param {string} key      The flag key
	 * @param {*} value         The flag value
	 *
	 * @return {Promise}        A Promise resolving to the updated EmbeddedEntity
	 */
	setFlag(scope: string, key: string, value: any): Promise<EmbeddedEntity>;

	/**
	 * Get the value of a "flag" for this EmbeddedEntity
	 * See the setFlag method for more details on flags
	 *
	 * @param {string} scope    The flag scope which namespaces the key
	 * @param {string} key      The flag key
	 * @return {*}              The flag value
	 */
	getFlag(scope: string, key: string): any;

	/**
	 * Remove a flag assigned to the EmbeddedEntity
	 * @param {string} scope    The flag scope which namespaces the key
	 * @param {string} key      The flag key
	 * @return {Promise}        A Promise resolving to the updated Entity
	 */
	unsetFlag(scope: string, key: string): Promise<EmbeddedEntity>;
}

/**
 * An Active Effect instance within a parent Actor or Item.
 * @see {@link Actor#effects}
 * @see {@link Item#effects} *
 * @typedef {{key: string, value: *, mode: number, priority: number}} ActiveEffectChange
 */
declare class ActiveEffect extends EmbeddedEntity {
	get duration(): any;

	/**
	 * Describe whether the ActiveEffect has a temporary duration based on combat turns or rounds.
	 */
	get isTemporary(): boolean;

	/**
	 * A cached property for obtaining the source name
	 */
	get sourceName(): string;

	/**
	 * A convenience method for creating an ActiveEffect instance within a parent Actor or Item.
	 * @see {@link Entity#createEmbeddedEntity}
	 * @param {Options} options     Configuration options which modify the request.
	 * @return                      The created ActiveEffect data.
	 */
	create(options: any): Promise<any>;

	/**
	 * A convenience method for updating an ActiveEffect instance in an parent Actor or Item.
	 * @see {@link Entity#updateEmbeddedEntity}
	 * @param {Data} data           Differential data with which to update the ActiveEffect.
	 * @param {Options} options     Configuration options which modify the request.
	 * @return                      The updated ActiveEffect data.
	 */
	update(data, options?: any): Promise<any>;

	/**
	 * A convenience method for deleting an ActiveEffect instance in an parent Actor or Item.
	 * @see {@link Entity#deleteEmbeddedEntity}
	 * @param {Options} options     Configuration options which modify the request.
	 * @return                      The deleted ActiveEffect _id.
	 */
	delete(options?: any): Promise<string>;

	/**
	 * A factory method which creates an ActiveEffect instance using the configured class.
	 * @param args      Initialization arguments passed to the ActiveEffect constructor.
	 * @return          The constructed ActiveEffect instance.
	 */
	static create(...args): Promise<ActiveEffect>;
}
