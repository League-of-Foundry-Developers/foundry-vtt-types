import { ConfiguredDocumentClass } from '../../../../types/helperTypes';
import { UserData } from '../../../common/data/data.mjs';

/**
 * The User Configuration application provides a form used to allow the current client to
 * edit preferences and configurations about a User entity (typically their own).
 * @typeParam P - the type of the options object
 */
declare class UserConfig<P extends FormApplication.Options = FormApplication.Options> extends FormApplication<
  P,
  UserConfig.Data,
  ConfiguredDocumentClass<typeof User>
> {
  /**
   * @param user    - The User entity being configured.
   * @param options - Additional rendering options which modify the behavior of the form.
   */
  constructor(user: ConfiguredDocumentClass<typeof User>, options?: Partial<P>);

  /** @override */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /** @override */
  get title(): string;

  /** @override */
  getData(options?: Application.RenderOptions): UserConfig.Data;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle changing the user avatar image by opening a FilePicker
   */
  protected _onEditAvatar(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

  /** @override */
  protected _updateObject(event: Event, formData: UserConfig.FormData): ReturnType<User['update']>;
}

declare namespace UserConfig {
  interface Data {
    user: ConfiguredDocumentClass<typeof User>;
    actors: ConfiguredDocumentClass<typeof Actor>[];
    options: UserConfig['options'];
  }

  type FormData = Pick<UserData, 'avatar' | 'character' | 'color'>;
}
