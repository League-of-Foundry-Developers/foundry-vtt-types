import type { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for configuring a single Wall document within a parent Scene.
   * @typeParam Options - The type of the options object
   */
  class WallConfig<
    Options extends DocumentSheetOptions<WallDocument> = DocumentSheetOptions<WallDocument>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"Wall">>> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.template = "templates/scene/wall-config.html";
     * options.width = 400;
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions<WallDocument>;

    /**
     * An array of Wall ids that should all be edited when changes to this config form are submitted
     * @defaultValue `[]`
     */
    editTargets: string[];

    override get title(): string;

    override render(
      force?: boolean,
      options?: Application.RenderOptions<Options> & {
        walls?: InstanceType<ConfiguredObjectClassForName<"Wall">>[] | undefined;
      }
    ): this;

    override getData(): MaybePromise<object>;

    protected override _updateObject(event: Event, formData: WallConfig.FormData): Promise<unknown>;
  }

  namespace WallConfig {
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
