import type { MaybePromise } from "fvtt-types/utils";

declare global {
  interface WorldConfigOptions extends FormApplicationOptions {
    /**
     * Whether the world is being created or updated.
     * @defaultValue `false`
     */
    create: boolean;
  }

  /**
   * The World Management setup application
   * @typeParam Options - The type of the options object
   */
  class WorldConfig<Options extends WorldConfigOptions = WorldConfigOptions> extends FormApplication<Options, World> {
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
    static override get defaultOptions(): WorldConfigOptions;

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
  }
}
