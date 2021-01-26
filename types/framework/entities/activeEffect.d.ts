/**
 * An Active Effect instance within a parent Actor or Item.
 * @see {@link Actor#effects}
 * @see {@link Item#effects} *
 */
declare class ActiveEffect extends EmbeddedEntity<ActiveEffect.Data> {
  /**
   * @param data - Data for the Active Effect
   * @param parent - The parent Entity which owns the effect
   */
  constructor(data: ActiveEffect.Data, parent: Actor | Item);

  /**
   * Report the active effect duration
   */
  get duration(): ActiveEffect.ReturnedDuration;

  /**
   * Describe whether the ActiveEffect has a temporary duration based on combat turns or rounds.
   */
  get isTemporary(): boolean;

  /**
   * A cached property for obtaining the source name
   */
  get sourceName(): string;

  /**
   * An instance of the ActiveEffectConfig sheet to use for this ActiveEffect instance.
   * The reference to the sheet is cached so the same sheet instance is reused.
   */
  get sheet(): ActiveEffectConfig;

  /**
   * Apply this ActiveEffect to a provided Actor.
   * @param actor - The Actor to whom this effect should be applied
   * @param change - The change data being applied
   * @returns The resulting applied value
   */
  apply<I extends Item, D extends Actor.Data>(actor: Actor<I, D>, change: ActiveEffect.Change): unknown;

  /**
   * A convenience method for creating an ActiveEffect instance within a parent Actor or Item.
   * @see {@link Entity#createEmbeddedEntity}
   * @param options - Configuration options which modify the request.
   * @returns The created ActiveEffect data.
   */
  create(options?: Entity.CreateOptions): Promise<ActiveEffect.Data>;

  /**
   * A convenience method for updating an ActiveEffect instance in an parent Actor or Item.
   * @see {@link Entity#updateEmbeddedEntity}
   * @param data - Differential data with which to update the ActiveEffect.
   * @param options - Configuration options which modify the request.
   * @returns The updated ActiveEffect data.
   */
  update(data: Partial<ActiveEffect.Data>, options?: Entity.UpdateOptions): Promise<ActiveEffect.Data>;

  /**
   * A convenience method for deleting an ActiveEffect instance in an parent Actor or Item.
   * @see {@link Entity#deleteEmbeddedEntity}
   * @param options - Configuration options which modify the request.
   * @returns The deleted ActiveEffect _id.
   */
  delete(options?: Entity.DeleteOptions): Promise<string>;

  /**
   * A factory method which creates an ActiveEffect instance using the configured class.
   * @param args - Initialization arguments passed to the ActiveEffect constructor.
   * @returns The constructed ActiveEffect instance.
   */
  static create(...args: [ActiveEffect.Data, Actor | Item]): ActiveEffect;

  /**
   * A helper function to handle obtaining dropped ActiveEffect data from a dropped data transfer event.
   * @param data - The data object extracted from a DataTransfer event
   * @returns The ActiveEffect instance which contains the dropped effect data or null, if other data was dropped.
   */
  static fromDropData(data: Record<string, unknown>): Promise<ActiveEffect | null>;
}

declare namespace ActiveEffect {
  interface Change {
    /**
     * The key
     */
    key: string;

    /**
     * The value of the change
     */
    value: unknown;

    /**
     * The mode of the change application
     */
    mode: number;

    /**
     * The priority with which this change is applied
     */
    priority: number;
  }

  interface Duration {
    /**
     * The game time in seconds when the effect started
     */
    startTime?: number;

    /**
     * The duration of the effect, in seconds
     */
    seconds?: number;

    /**
     * The _id of the Combat entity where the effect began
     */
    combat?: string;

    /**
     * The number of combat rounds the effect lasts
     */
    rounds?: number;

    /**
     * The number of combat turns that the effect lasts
     */
    turns?: number;

    /**
     * The round of combat in which the effect started
     */
    startRound?: number;

    /**
     * The turn of combat in which the effect started
     */
    startTurn?: number;
  }

  interface ReturnedDuration {
    type: string;
    duration: number | null;
    remaining: number | null;
    label: string;
  }

  interface Data extends EmbeddedEntity.Data {
    /**
     * The label which describes this effect
     */
    label: string;

    /**
     * The duration of the effect
     */
    duration: Duration;

    /**
     * The changes applied by this effect
     */
    changes: Array<Change>;

    /**
     * Is this effect currently disabled?
     */
    disabled?: boolean;

    /**
     * An image icon path for this effect
     */
    icon?: string;

    /**
     * A hex color string to tint the effect icon
     */
    tint?: string;

    /**
     * The UUID of an Entity or EmbeddedEntity which was the source of this effect
     */
    origin?: string;

    /**
     * Should this effect transfer automatically to an Actor when its Item becomes owned?
     */
    transfer?: boolean;
  }
}
