declare global {
  /**
   * @deprecated since v9
   */
  class LightConfig extends AmbientLightConfig {
    constructor(...args: ConstructorParameters<typeof AmbientLightConfig>);
  }
}

export {};
