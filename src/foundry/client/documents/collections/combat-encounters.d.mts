import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Combat documents which exist within the active World.
 * This Collection is accessible within the Game object as game.combats.
 *
 * @see {@linkcode Combat} The Combat document
 * @see {@linkcode CombatTracker} The CombatTracker sidebar directory
 */
declare class CombatEncounters extends foundry.documents.abstract.WorldCollection<"Combat", "CombatEncounters"> {
  static documentName: "Combat";

  /**
   * Provide the settings object which configures the Combat document
   */
  static get settings(): foundry.helpers.ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

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

declare namespace CombatEncounters {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyCombatEncounters {}
    interface AnyConstructor extends Identity<typeof AnyCombatEncounters> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Combat"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Combat"> {}

  /**
   * @deprecated Replaced by {@linkcode CombatEncounters.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode CombatEncounters.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyCombatEncounters extends CombatEncounters {
  constructor(...args: never);
}

export default CombatEncounters;
