import type { MaybePromise } from "#utils";

declare global {
  /** @deprecated Replaced with {@linkcode WorldConfig.Options} */
  type WorldConfigOptions = WorldConfig.Options;

  /**
   * The World Management setup application
   * @template Options - The type of the options object
   */
  class WorldConfig<Options extends WorldConfig.Options = WorldConfig.Options> extends FormApplication<World, Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "world-config",
     *   template: "templates/sidebar/apps/world-config.html",
     *   width: 620,
     *   height: "auto",
     *   create: false,
     * })
     * ```
     */
    static override get defaultOptions(): WorldConfig.Options;

    /**
     * A semantic alias for the World object which is being configured by this form.
     */
    get world(): World;

    override get title(): string;

    override activateListeners(html: JQuery): void;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _getSubmitData(updateData?: object | null): WorldConfig.FormData;

    protected override _updateObject(event: Event, formData: WorldConfig.FormData): Promise<number | void>;

    override activateEditor(
      name: string,
      options?: TextEditor.Options,
      initialContent?: string,
    ): ReturnType<FormApplication["activateEditor"]>;
  }

  namespace WorldConfig {
    type FormData = Partial<World["_source"]>;

    interface Options extends FormApplication.Options {
      /**
       * Whether the world is being created or updated.
       * @defaultValue `false`
       */
      create: boolean;
    }
  }
}
