import type { Identity, InexactPartial, NullishProps } from "#utils";

declare namespace ConvolverEffect {}

/**
 * A sound effect which applies a convolver filter.
 * The convolver effect splits the input sound into two separate paths:
 * 1. A "dry" node which is the original sound
 * 2. A "wet" node which contains the result of the convolution
 * This effect mixes between the dry and wet channels based on the intensity of the reverb effect.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode}
 */
declare class ConvolverEffect extends ConvolverNode {
  /**
   * A ConvolverEffect is constructed by passing the following parameters.
   * @param context - The audio context required by the ConvolverNode
   * @param options - Additional options which modify the ConvolverEffect behavior
   */
  // options: not null (destructured)
  constructor(context: AudioContext, options?: ConvolverEffect.ConstructorOptions);

  /**
   * Adjust the intensity of the effect on a scale of 0 to 10.
   */
  get intensity(): number;

  set intensity(value);

  /**
   * Update the state of the effect node given the active flag and numeric intensity.
   * @param options - Options which are updated
   */
  // options: not null (destructured)
  update(options?: ConvolverEffect.UpdateOptions): void;

  /** @privateRemarks This override only does side effects then forwards args to super, no type changes */
  override disconnect(output?: number): void;
  override disconnect(destinationNode?: AudioNode, output?: number, input?: number): void;
  override disconnect(destinationParam?: AudioParam, output?: number): void;

  /** @remarks Foundry only supports the "pass a node, get that node returned" signature */
  override connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
  /** @deprecated Foundry does not support this signature, only the other overload */
  override connect(destinationParam: AudioParam, output?: number): AudioParam;

  /**
   * Additional side effects performed when some other AudioNode connects to this one.
   * This behavior is not supported by the base WebAudioAPI but is needed here for more complex effects.
   * @param sourceNode - An upstream source node that is connecting to this one
   */
  onConnectFrom(sourceNode: AudioNode): void;
}

declare namespace ConvolverEffect {
  interface Any extends AnyConvolverEffect {}
  interface AnyConstructor extends Identity<typeof AnyConvolverEffect> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The file path to the impulse response buffer to use
     * @defaultValue `"sounds/impulse-responses/ir-full.wav"`
     * @remarks Can't be `null` as it only has a parameter default
     */
    impulseResponsePath: string;

    /**
     * The initial intensity of the effect
     * @defaultValue `5`
     * @remarks Can't be `null` as it only has a parameter default
     */
    intensity: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions, ConvolverOptions {}

  /** @internal */
  type _UpdateOptions = NullishProps<{
    /**
     * A new effect intensity
     * @remarks This is ignored if it fails a `Number.isFinite` check
     */
    intensity: number;
  }>;

  interface UpdateOptions extends _UpdateOptions {}
}

export default ConvolverEffect;

declare abstract class AnyConvolverEffect extends ConvolverEffect {
  constructor(...args: never);
}
