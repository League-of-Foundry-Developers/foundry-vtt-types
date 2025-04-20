import type { Identity } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Combat documents which exist within the active World.
   * This Collection is accessible within the Game object as game.combats.
   *
   * @see {@link Combat | `Combat`} The Combat document
   * @see {@link CombatTracker | `CombatTracker`} The CombatTracker sidebar directory
   */
  class CombatEncounters extends WorldCollection<Combat.ImplementationClass, "CombatEncounters"> {
    static documentName: "Combat";

    /**
     * Provide the settings object which configures the Combat document
     */
    static get settings(): ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

    override get directory(): typeof ui.combat;

    /**
     * Get an Array of Combat instances which apply to the current canvas scene
     */
    get combats(): ReturnType<this["filter"]>;

    /**
     * The currently active Combat instance
     */
    get active(): ReturnType<this["find"]>;

    /**
     * The currently viewed Combat encounter
     */
    get viewed(): Combat.Stored | null;

    /**
     * When a Token is deleted, remove it as a combatant from any combat encounters which included the Token
     * @param sceneId - The Scene id within which a Token is being deleted
     * @param tokenId - The Token id being deleted
     */
    protected _onDeleteToken(sceneId: string, tokenId: string): Promise<void>;
  }

  namespace CombatEncounters {
    interface Any extends AnyCombatEncounters {}
    interface AnyConstructor extends Identity<typeof AnyCombatEncounters> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Combat"> {}
    interface Configured extends Document.ConfiguredCollection<"Combat"> {}
  }
}

declare abstract class AnyCombatEncounters extends CombatEncounters {
  constructor(...args: never);
}
