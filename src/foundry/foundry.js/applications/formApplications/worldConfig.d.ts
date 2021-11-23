/**
 * The World Management setup application
 * @typeParam Options - The type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class WorldConfig<
  Options extends WorldConfig.Options = WorldConfig.Options,
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
  static get defaultOptions(): WorldConfig.Options;

  static WORLD_KB_URL: 'https://foundryvtt.com/article/game-worlds/';

  /** @override */
  get title(): string;

  /** @override */
  getData(options?: Partial<Options>): Data | Promise<Data>;

  /**
   * @remarks This method returns `Promise<void>`.
   * @override
   */
  protected _onSubmit(event: Event): Promise<any>;

  /**
   * @remarks This method does not exist on WorldConfig and only exists to make the typescript compile!
   */
  protected _updateObject(...args: unknown[]): Promise<unknown>;

  /** @override **/
  activateEditor(name: string, options?: TextEditor.Options, initialContent?: string): void;
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

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `false`
     */
    create: boolean;

    inWorld?: boolean;
  }
}
