import { ConfiguredDocumentClass } from '../../../../types/helperTypes';
import { UserData } from '../../../common/data/data.mjs';

declare global {
  // TODO: Do Not extend FormApplication but DocumentSheet
  /**
   * The User Configuration application provides a form used to allow the current client to edit preferences and
   * configurations about a User entity (typically their own).
   * @typeParam P - the type of the options object
   */
  class UserConfig<P extends DocumentSheet.Options = DocumentSheet.Options> extends FormApplication<
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
  user: ConfiguredDocumentClass<typeof User>;
  actors: ConfiguredDocumentClass<typeof Actor>[];
  options: UserConfig['options'];
}

type FormData = Pick<UserData, 'avatar' | 'character' | 'color'>;
