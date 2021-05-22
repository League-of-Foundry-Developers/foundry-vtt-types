import { SourceDataType } from '../../../common/abstract/document';

declare global {
  /**
   * The Collection of Macro entities
   */
  class Macros /* TODO: Extends WorldCollection<Macro>*/ {
    /** @override */
    static documentName: 'Macro';

    /**
     * @deprecated since 0.8.1
     */
    static canUseScripts(user: User): boolean;

    /** @override */
    get directory(): MacroDirectory;

    fromCompendium(
      document: foundry.documents.BaseMacro | SourceDataType<foundry.documents.BaseMacro>
    ): SourceDataType<foundry.documents.BaseMacro> | ReturnType<foundry.documents.BaseMacro['toObject']>; // TODO: Improve
  }
}
