import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Wall document within a parent Scene.
   * @typeParam Options - The type of the options object
   */
  class WallConfig<
    Options extends
      DocumentSheet.Options<WallDocument.Implementation> = DocumentSheet.Options<WallDocument.Implementation>,
  > extends DocumentSheet<Options, WallDocument.Implementation> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("wall-config");
     * options.template = "templates/scene/wall-config.html";
     * options.width = 400;
     * options.height = "auto";
     * return options;
     * ```
     */
    static get defaultOptions(): DocumentSheet.Options<WallDocument.Implementation>;

    /**
     * An array of Wall ids that should all be edited when changes to this config form are submitted
     * @defaultValue `[]`
     */
    editTargets: string[];

    override get title(): string;

    override render(
      force?: boolean,
      options?: Application.RenderOptions<Options> & {
        walls?: Wall.Object[] | undefined;
      },
    ): this;

    override getData(): MaybePromise<object>; // TODO: Implement GetDataReturnType

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected _onChangeInput(event: JQuery.ChangeEvent<any, any, any, any>): Promise<void | object>;

    protected _getSubmitData(updateData?: object | null): WallConfig.FormData;

    protected override _updateObject(event: Event, formData: WallConfig.FormData): Promise<unknown>;
  }

  namespace WallConfig {
    type Any = WallConfig<any>;

    type FormData = Pick<
      WallDocument["_source"],
      "move" | "light" | "sight" | "sound" | "dir" | "door" | "ds" | "doorSound"
    > & {
      "threshold.light": WallDocument["_source"]["threshold"]["light"];
      "threshold.sight": WallDocument["_source"]["threshold"]["sight"];
      "threshold.sound": WallDocument["_source"]["threshold"]["sound"];
      "threshold.attenuation": WallDocument["_source"]["threshold"]["attenuation"];
    };
  }
}
