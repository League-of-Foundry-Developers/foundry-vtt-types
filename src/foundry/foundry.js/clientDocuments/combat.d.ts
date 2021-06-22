// TODO
declare global {
  /**
   * The client-side Combat document which extends the common BaseCombat abstraction.
   * Each Combat document contains CombatData which defines its data schema.
   *
   * @see {@link data.CombatData}               The Combat data schema
   * @see {@link documents.Combats}             The world-level collection of Combat documents
   * @see {@link embedded.Combatant}            The Combatant embedded document which exists within a Combat document
   * @see {@link applications.CombatConfig}     The Combat configuration application
   *
   * @param data - Initial data provided to construct the Combat document
   */
  class Combat extends ClientDocumentMixin(foundry.documents.BaseCombat) {
    /**
     * The configuration setting used to record Combat preferences
     */
    static CONFIG_SETTING: 'combatTrackerConfig';
  }
}

export {};
