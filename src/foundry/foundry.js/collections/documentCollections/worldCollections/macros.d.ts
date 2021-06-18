import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * The singleton collection of Macro documents which exist within the active World.
   * This Collection is accessible within the Game object as game.macros.
   *
   * @see {@link Macro} The Macro entity
   * @see {@link MacroDirectory} The MacroDirectory sidebar directory
   */
  class Macros extends WorldCollection<typeof foundry.documents.BaseMacro, 'Macros'> {
    /** @override */
    static documentName: 'Macro';

    /** @override */
    get directory(): typeof ui.macros;

    /** @override */
    fromCompendium(
      document:
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>['data']['_source']
    ): Omit<
      InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>['data']['_source'],
      '_id' | 'folder'
    >;

    /**
     * You are calling Macros.canUseScripts which has been deprecated in favor of User#can('MACRO_SCRIPT')
     * @deprecated since 0.8.1
     */
    static canUseScripts(user: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseUser>>): boolean;
  }
}
