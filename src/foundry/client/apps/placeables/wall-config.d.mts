import type { AnyObject, InterfaceToObject, MaybePromise } from "fvtt-types/utils";

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

    protected _getSubmitData(updateData?: AnyObject | null): InterfaceToObject<WallConfig.FormData>;

    protected override _updateObject(event: Event, formData: WallConfig.FormData): Promise<unknown>;
  }

  namespace WallConfig {
    interface Any extends WallConfig<any> {}

    /** @internal */
    type _FormData = Pick<WallDocument, "dir" | "door" | "doorSound" | "ds" | "light" | "move" | "sight" | "sound">;

    interface FormData extends _FormData {
      "threshold.light": WallDocument["threshold"]["light"];
      "threshold.sight": WallDocument["threshold"]["sight"];
      "threshold.sound": WallDocument["threshold"]["sound"];
      "threshold.attenuation": WallDocument["threshold"]["attenuation"];
    }
  }
}
