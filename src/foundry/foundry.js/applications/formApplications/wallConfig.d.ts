import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Wall document within a parent Scene.
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class WallConfig<
    Options extends FormApplication.Options = FormApplication.Options,
    Data extends object = WallConfig.Data<Options>
  > extends FormApplication<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Wall'>>> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.id = "wall-config";
     * options.title = "Wall Configuration";
     * options.template = "templates/scene/wall-config.html";
     * options.width = 400;
     * ```
     */
    static get defaultOptions(): FormApplication.Options;

    /** @override */
    get title(): string;

    /** @override */
    render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    /** @override */
    getData(): Data | Promise<Data>;

    /** @override */
    protected _updateObject(
      event: Event,
      formData: WallConfig.FormData
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'Wall'>> | undefined>;
  }

  namespace WallConfig {
    interface Data<Options extends FormApplication.Options = FormApplication.Options> {
      object: foundry.data.WallData['_source'];
      options: Options;
      moveTypes: {
        [Key in keyof typeof foundry.CONST.WALL_MOVEMENT_TYPES as typeof foundry.CONST.WALL_MOVEMENT_TYPES[Key]]: Titlecase<Key>;
      };
      senseTypes: {
        [Key in keyof typeof foundry.CONST.WALL_SENSE_TYPES as typeof foundry.CONST.WALL_SENSE_TYPES[Key]]: Titlecase<Key>;
      };
      dirTypes: {
        [Key in keyof typeof foundry.CONST.WALL_DIRECTIONS as typeof foundry.CONST.WALL_DIRECTIONS[Key]]: Titlecase<Key>;
      };
      doorTypes: {
        [Key in keyof typeof foundry.CONST.WALL_DOOR_TYPES as typeof foundry.CONST.WALL_DOOR_TYPES[Key]]: Titlecase<Key>;
      };
      doorStates: {
        [Key in keyof typeof foundry.CONST.WALL_DOOR_STATES as typeof foundry.CONST.WALL_DOOR_STATES[Key]]: Titlecase<Key>;
      };
      isDoor: boolean;
    }

    interface FormData {
      dir: foundry.CONST.WALL_DIRECTIONS;
      door: foundry.CONST.WALL_DOOR_TYPES;
      ds?: foundry.CONST.WALL_DOOR_STATES;
      move: foundry.CONST.WALL_MOVEMENT_TYPES;
      sense: foundry.CONST.WALL_SENSE_TYPES;
      sound: foundry.CONST.WALL_SENSE_TYPES;
    }
  }
}
