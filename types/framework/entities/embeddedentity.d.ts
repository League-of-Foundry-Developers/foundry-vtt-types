declare abstract class EmbeddedEntity {
	constructor(data: any, parent: Entity);
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
	 * @return                       The created ActiveEffect data.
	 */
	create(options: any): Promise<any>;

	/**
	 * A convenience method for updating an ActiveEffect instance in an parent Actor or Item.
	 * @see {@link Entity#updateEmbeddedEntity}
	 * @param {Data} data           Differential data with which to update the ActiveEffect.
	 * @param {Options} options     Configuration options which modify the request.
	 * @return                      The updated ActiveEffect data.
	 */
	update(data, options: any): Promise<any>;

	/**
	 * A convenience method for deleting an ActiveEffect instance in an parent Actor or Item.
	 * @see {@link Entity#deleteEmbeddedEntity}
	 * @param {Options} options     Configuration options which modify the request.
	 * @return                      The deleted ActiveEffect _id.
	 */
	delete(options: any): Promise<string>;

	/**
	 * A factory method which creates an ActiveEffect instance using the configured class.
	 * @param args      Initialization arguments passed to the ActiveEffect constructor.
	 * @return          The constructed ActiveEffect instance.
	 */
	static create(...args): Promise<ActiveEffect>;
}
