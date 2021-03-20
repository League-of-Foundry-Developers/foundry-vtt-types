/**
 * The World Management setup application
 */
declare class WorldConfig extends FormApplication<WorldConfig.Options, WorldConfig.Data, Game.World> {
  /**
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "world-config",
   *   template: "templates/setup/world-config.html",
   *   width: 600,
   *   height: "auto",
   *   create: false
   * });
   * ```
   */
  static get defaultOptions(): WorldConfig.Options;

  /** @override */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): WorldConfig.Data;

  /**
   * @remarks This method returns `Promise<void>`.
   * @override
   */
  protected _onSubmit(event: Event): Promise<any>;

  /**
   * @remarks This method does not exist on WorldConfig and only exists to make the typescript compile!
   */
  protected _updateObject(...args: unknown[]): never;
}

declare namespace WorldConfig {
  interface Data {
    world: WorldConfig['object'];
    systems: Game.System[];
    isCreate: WorldConfig['options']['create'];
    submitText: string;
    nextDate: string;
    nextTime: string;
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `false`
     */
    create: boolean;
  }
}
