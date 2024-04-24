import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { GetDataReturnType, MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single User document.
   * @typeParam Options - the type of the options object
   */
  class UserConfig<Options extends UserConfig.Options = UserConfig.Options> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClass<typeof User>>
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "user-config"],
     *   template: "templates/user/user-config.html",
     *   width: 400,
     *   height: "auto"
     * })
     * ```
     */
    static override get defaultOptions(): UserConfig.Options;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<UserConfig.UserConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle changing the user avatar image by opening a FilePicker
     */
    protected _onEditAvatar(event: JQuery.ClickEvent): ReturnType<FilePicker["browse"]>;
  }

  namespace UserConfig {
    interface Options extends DocumentSheetOptions<User> {
      /**
       * @defaultValue `["sheet", "user-config"]`
       */
      classes: DocumentSheetOptions["classes"];

      /**
       * @defaultValue `"templates/user/user-config.html"`
       */
      template: DocumentSheetOptions["template"];

      /**
       * @defaultValue `400`
       */
      width: DocumentSheetOptions["width"];

      /**
       * @defaultValue `"auto"`
       */
      height: DocumentSheetOptions["height"];
    }

    interface UserConfigData<Options extends DocumentSheetOptions<User> = DocumentSheetOptions<User>> {
      user: UserConfig<Options>["object"];
      actors: ConfiguredDocumentClass<typeof Actor>[];
      options: UserConfig<Options>["options"];
    }
  }
}

type FormData = Pick<foundry.data.UserData, "avatar" | "character" | "color">;
