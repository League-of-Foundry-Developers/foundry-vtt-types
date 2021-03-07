/**
 * Wall Configuration Sheet
 */
declare class WallConfig extends FormApplication<WallConfig.Data, Wall> {
  /**
   * @param object - The Wall object for which settings are being configured
   * @param options - Additional options which configure the rendering of the configuration sheet.
   */
  constructor(object: Wall, options?: WallConfig.Options);

  options: WallConfig.Options;

  /**
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.id = "wall-config";
   * options.title = "Wall Configuration";
   * options.template = "templates/scene/wall-config.html";
   * options.width = 400;
   * options.editTargets = [];
   * ```
   */
  static get defaultOptions(): WallConfig.Options;

  /**
   * Provide a dynamically rendered title for the Wall Configuration sheet
   */
  get title(): string;

  /**
   * Construct and return the data object used to render the HTML template for this form application.
   */
  getData(): WallConfig.Data;

  /**
   * This method is called upon form submission after form data is validated
   * @param event    - The initial triggering submission event
   * @param formData - The object of validated form data with which to update the object
   */
  protected _updateObject(event: Event, formData: WallConfig.FormData): Promise<Wall>;
}

declare namespace WallConfig {
  interface Data {
    object: Duplicated<WallConfig['object']['data']>;
    options: WallConfig['options'];
    moveTypes: {
      [Key in keyof typeof CONST['WALL_MOVEMENT_TYPES'] as typeof CONST['WALL_MOVEMENT_TYPES'][Key]]: Capitalize<
        Lowercase<Key>
      >;
    };
    senseTypes: {
      [Key in keyof typeof CONST['WALL_SENSE_TYPES'] as typeof CONST['WALL_SENSE_TYPES'][Key]]: Capitalize<
        Lowercase<Key>
      >;
    };
    dirTypes: {
      [Key in keyof typeof CONST['WALL_DIRECTIONS'] as typeof CONST['WALL_DIRECTIONS'][Key]]: Capitalize<
        Lowercase<Key>
      >;
    };
    doorTypes: {
      [Key in keyof typeof CONST['WALL_DOOR_TYPES'] as typeof CONST['WALL_DOOR_TYPES'][Key]]: Capitalize<
        Lowercase<Key>
      >;
    };
    doorStates: {
      [Key in keyof typeof CONST['WALL_DOOR_STATES'] as typeof CONST['WALL_DOOR_STATES'][Key]]: Capitalize<
        Lowercase<Key>
      >;
    };
    isDoor: boolean;
  }

  interface FormData {
    dir: Const.WallDirection;
    door: Wall.Data['door'];
    ds?: Wall.Data['ds'];
    move: Wall.Data['move'];
    sense: Wall.Data['sense'];
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `[]`
     */
    editTargets: string[];
  }
}
