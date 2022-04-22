interface WorldConfigOptions extends FormApplicationOptions {
  /**
   * Whether the world is being created or updated.
   * @defaultValue `false`
   */
  create: boolean;

  inWorld?: boolean | undefined;
}

/**
 * The World Management setup application
 * @typeParam Options - The type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class WorldConfig<
  Options extends WorldConfigOptions = WorldConfigOptions,
  Data extends object = WorldConfig.Data
> extends FormApplication<Options, Data, Game.WorldData<foundry.packages.WorldData>> {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   id: "world-config",
   *   template: "templates/sidebar/apps/world-config.html",
   *   width: 600,
   *   height: "auto",
   *   create: false,
   * })
   * ```
   */
  static override get defaultOptions(): WorldConfigOptions;

  static WORLD_KB_URL: 'https://foundryvtt.com/article/game-worlds/';

  override get title(): string;

  override activateListeners(html: JQuery): void;

  override getData(options?: Partial<Options>): Data | Promise<Data>;

  /**
   * @remarks This method returns `Promise<void>`.
   */
  protected override _onSubmit(event: Event): Promise<any>;

  /**
   * @remarks This method does not exist on WorldConfig and only exists to make the typescript compile!
   */
  protected _updateObject(...args: unknown[]): Promise<unknown>;

  /**
   * Update the world name placeholder when the title is changed.
   * @internal
   */
  protected _onTitleChange(event: JQuery.TriggeredEvent): void;

  override activateEditor(
    name: string,
    options?: TextEditor.Options | undefined,
    initialContent?: string | undefined
  ): void;
}

declare namespace WorldConfig {
  interface Data {
    world: Game.WorldData<foundry.packages.WorldData>;
    isCreate: boolean;
    submitText: string;
    nextDate: string;
    nextTime: string;
    worldKbUrl: typeof WorldConfig['WORLD_KB_URL'];
    inWorld: boolean;
    showEditFields: boolean;
    systems?: Game.SystemData<foundry.packages.SystemData>[];
  }
}
