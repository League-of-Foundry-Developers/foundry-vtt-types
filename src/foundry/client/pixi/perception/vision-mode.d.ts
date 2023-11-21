export {};

declare global {
  class ShaderField extends foundry.data.fields.DataField {
    /**
     * @defaultValue
     * ```typescript
     * const defaults = super._defaults;
     * defaults.nullable = true;
     * defaults.initial = undefined;
     * return defaults;
     * ```
     */
    static override get _defaults(): Record<string, unknown>;
  }

  class VisionMode extends foundry.abstract.DataModel {}
}
