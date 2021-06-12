declare global {
  /**
   * The Collection of Macro entities
   */
  class Macros {
    /* TODO: Extends WorldCollection<Macro>*/

    /** @override */
    static documentName: 'Macro';

    /** @override */
    get directory(): MacroDirectory;

    fromCompendium(
      document: foundry.documents.BaseMacro | foundry.data.MacroData['_source']
    ): Omit<foundry.data.MacroData['_source'], '_id' | 'folder'>; // TODO: Improve

    /**
     * @deprecated since 0.8.1
     */
    static canUseScripts(user: User): boolean;
  }
}

export {};
