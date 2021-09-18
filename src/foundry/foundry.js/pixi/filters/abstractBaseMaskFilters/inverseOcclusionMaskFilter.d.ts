/**
 * A filter used to control channels intensity using an externally provided mask texture.
 * The mask channel used must be provided at filter creation.
 * Contributed by SecretFire#4843
 */
declare class InverseOcclusionMaskFilter extends AbstractBaseMaskFilter {
  static fragmentShader(channel: 'r' | 'g' | 'b'): string;

  /**
   * @param defaultUniforms - (default: `{}`)
   * @param channel  - (default `'r'`)
   */
  static create<T extends InverseOcclusionMaskFilter>(
    this: ConstructorOf<T>,
    defaultUniforms?: ConstructorParameters<typeof PIXI.Filter>[2],
    channel?: 'r' | 'g' | 'b'
  ): T;
}
