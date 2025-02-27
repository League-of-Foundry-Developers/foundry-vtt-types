import type { ValueOf } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseCombatant from "../../../common/documents/combatant.d.mts";

declare global {
  namespace Combatant {
    type Metadata = Document.MetadataFor<Combatant>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Combatant">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Combatant">;

    interface DatabaseOperations
      extends Document.Database.Operations<
        Combatant,
        { combatTurn: number },
        { combatTurn: number },
        { combatTurn: number }
      > {}

    // Helpful aliases
    type TypeNames = BaseCombatant.TypeNames;
    type ConstructorData = BaseCombatant.ConstructorData;
    type UpdateData = BaseCombatant.UpdateData;
    type Schema = BaseCombatant.Schema;
    type Source = BaseCombatant.Source;
  }

  /**
   * The client-side Combatant document which extends the common BaseCombatant model.
   *
   * @see {@link Combat}                    The Combat document which contains Combatant embedded documents
   * @see {@link CombatantConfig}        The Combatant configuration application
   */
  class Combatant extends ClientDocumentMixin(foundry.documents.BaseCombatant) {
    static override metadata: Combatant.Metadata;

    static get implementation(): Combatant.ConfiguredClass;

    /**
     * The token video source image (if any)
     */
    _videoSrc: string | null;

    /** The current value of the special tracked resource which pertains to this Combatant */
    resource: `${number}` | number | boolean | null;

    /**
     * A convenience alias of Combatant#parent which is more semantically intuitive
     */
    get combat(): Combat.ConfiguredInstance | null;

    /** This is treated as a non-player combatant if it has no associated actor and no player users who can control it */
    get isNPC(): boolean;

    /**
     * Eschew `ClientDocument`'s redirection to `Combat#permission` in favor of special ownership determination.
     */
    override get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

    override get visible(): boolean;

    /** A reference to the Actor document which this Combatant represents, if any */
    get actor(): Actor.ConfiguredInstance | null;

    /** A reference to the Token document which this Combatant represents, if any */
    get token(): TokenDocument.ConfiguredInstance | null;

    /** An array of User documents who have ownership of this Document */
    get players(): User.ConfiguredInstance[];

    /**
     * Has this combatant been marked as defeated?
     */
    get isDefeated(): boolean;

    override testUserPermission(
      user: User,
      permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
      { exact }?: { exact?: boolean },
    ): boolean;

    /**
     * Get a Roll object which represents the initiative roll for this Combatant.
     * @param formula -  An explicit Roll formula to use for the combatant.
     * @returns The Roll instance to use for the combatant.
     */
    getInitiativeRoll(formula?: string): Roll;

    /**
     * Roll initiative for this particular combatant.
     * @param formula - A dice formula which overrides the default for this Combatant.
     * @returns The updated Combatant.
     */
    rollInitiative(formula: string): Promise<this | undefined>;

    override prepareDerivedData(): void;

    /**
     * Update the value of the tracked resource for this Combatant.
     */
    updateResource(): this["resource"];

    /**
     * Acquire the default dice formula which should be used to roll initiative for this combatant.
     * Modules or systems could choose to override or extend this to accommodate special situations.
     * @returns  The initiative formula to use for this combatant.
     */
    protected _getInitiativeFormula(): string;

    /**
     * @deprecated since v9
     */
    get isVisible(): boolean;
  }
}
