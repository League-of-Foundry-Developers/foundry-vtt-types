import type { GetDataReturnType, MaybePromise } from "#utils";

declare global {
  /**
   * The Application responsible for configuring a single User document.
   * @template Options - the type of the options object
   */
  class UserConfig<Options extends UserConfig.Options = UserConfig.Options> extends DocumentSheet<
    User.Implementation,
    Options
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
    interface Any extends UserConfig<any> {}

    interface Options extends DocumentSheet.Options<User.Implementation> {
      /**
       * @defaultValue `["sheet", "user-config"]`
       */
      classes: DocumentSheet.Options["classes"];

      /**
       * @defaultValue `"templates/user/user-config.html"`
       */
      template: DocumentSheet.Options["template"];

      /**
       * @defaultValue `400`
       */
      width: DocumentSheet.Options["width"];

      /**
       * @defaultValue `"auto"`
       */
      height: DocumentSheet.Options["height"];
    }

    interface UserConfigData<
      Options extends DocumentSheet.Options<User.Implementation> = DocumentSheet.Options<User.Implementation>,
    > {
      user: UserConfig<Options>["object"];
      actors: Actor.ImplementationClass[];
      options: UserConfig<Options>["options"];
    }
  }
}

interface FormData extends Pick<User.Implementation["_source"], "avatar" | "character" | "color"> {}
