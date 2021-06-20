import { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The User Configuration application provides a form used to allow the current client to edit preferences and
   * configurations about a User entity (typically their own).
   * @typeParam P - the type of the options object
   */
  class UserConfig<P extends DocumentSheet.Options = DocumentSheet.Options> extends DocumentSheet<
    P,
    Data,
    InstanceType<ConfiguredDocumentClass<typeof User>>
  > {
    /** @override */
    static get defaultOptions(): Options;

    /** @override */
    get title(): string;

    /** @override */
    getData(options?: Application.RenderOptions): Data;

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Handle changing the user avatar image by opening a FilePicker
     */
    protected _onEditAvatar(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

    /** @override */
    protected _updateObject(event: Event, formData: FormData): ReturnType<User['update']>;
  }
}

interface Options extends DocumentSheet.Options {
  /**
   * @defaultValue `["sheet", "user-config"]`
   */
  classes: DocumentSheet.Options['classes'];

  /**
   * @defaultValue `"templates/user/user-config.html"`
   */
  template: DocumentSheet.Options['template'];

  /**
   * @defaultValue `400`
   */
  width: DocumentSheet.Options['width'];

  /**
   * @defaultValue `auto`
   */
  height: DocumentSheet.Options['height'];
}

interface Data {
  user: InstanceType<ConfiguredDocumentClass<typeof User>>;
  actors: InstanceType<ConfiguredDocumentClass<typeof Actor>>[];
  options: UserConfig['options'];
}

type FormData = Pick<foundry.data.UserData, 'avatar' | 'character' | 'color'>;
