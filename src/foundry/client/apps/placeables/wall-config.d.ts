import type { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Wall document within a parent Scene.
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class WallConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = WallConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Wall'>>> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.template = "templates/scene/wall-config.html";
     * options.width = 400;
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions;

    /**
     * An array of Wall ids that should all be edited when changes to this config form are submitted
     * @defaultValue `[]`
     */
    editTargets: string[];

    override get title(): string;

    override render(
      force?: boolean,
      options?: Application.RenderOptions<Options> & {
        walls?: InstanceType<ConfiguredObjectClassForName<'Wall'>>[] | undefined;
      }
    ): this;

    override getData(): Data | Promise<Data>;

    protected override _updateObject(event: Event, formData: WallConfig.FormData): Promise<unknown>;
  }

  namespace WallConfig {
    interface Data<Options extends DocumentSheetOptions = DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Wall'>>, Options> {
      object: DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Wall'>>, Options>['data'];
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
      light: foundry.CONST.WALL_SENSE_TYPES;
      ds?: foundry.CONST.WALL_DOOR_STATES;
      move: foundry.CONST.WALL_MOVEMENT_TYPES;
      sight: foundry.CONST.WALL_SENSE_TYPES;
      sound: foundry.CONST.WALL_SENSE_TYPES;
    }
  }
}
