import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  interface SoundSourceData extends PointSource.Data {
    x: number;

    y: number;

    /** The radius of the sound effect */
    radius: number;

    walls: boolean;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of sound sources.
   */
  class SoundSource extends PointSource {
    /** @param object - The AmbientSound object that generates this sound source */
    constructor(object: InstanceType<ConfiguredObjectClassForName<"AmbientSound">>);

    static override sourceType: "sound";

    /**
     * The object of data which configures how the source is rendered
     * @defaultValue `{}`
     */
    data: Partial<SoundSourceData>;

    /**
     * Initialize the source with provided object data.
     * @param data - Initial data provided to the point source
     * @returns A reference to the initialized source
     */
    initialize(data?: Partial<SoundSourceData>): this;

    /**
     * Process new input data provided to the SoundSource.
     * @param data - Initial data provided to the sound source
     * @returns The changes compared to the prior data
     * @internal
     */
    protected _initializeData(data: Partial<SoundSourceData>): void;
  }
}
