import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { ClientSettings } from "#client/helpers/_module.d.mts";

/**
 * The singleton collection of Combat documents which exist within the active World.
 * This Collection is accessible within the Game object as game.combats.
 *
 * @see {@linkcode foundry.documents.Combat}: The Combat document
 * @see {@linkcode foundry.applications.sidebar.tabs.CombatTracker}: The CombatTracker sidebar directory
 */
declare class CombatEncounters extends WorldCollection<"Combat"> {
  static override documentName: "Combat";

  /** @privateRemarks Fake type override */
  static override get instance(): CombatEncounters.Implementation;

  /** Provide the settings object which configures the Combat document */
  static get settings(): ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

  override get directory(): typeof ui.combat;

  /**
   * Get an Array of Combat instances which apply to the current canvas scene
   */
  get combats(): Combat.Stored[];

  /**
   * The currently active Combat instance
   */
  get active(): Combat.Stored | undefined;

  /**
   * The currently viewed Combat encounter
   */
  get viewed(): Combat.Stored | null;

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14. */
  protected _onDeleteToken(...args: never): never;
}

declare namespace CombatEncounters {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode CombatEncounters.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode CombatEncounters.ImplementationClass} instead. This will be removed in v15.
   */ type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyCombatEncounters {}
    interface AnyConstructor extends Identity<typeof AnyCombatEncounters> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Combat"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Combat"> {}

  /** @deprecated Replaced by {@linkcode CombatEncounters.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode CombatEncounters.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default CombatEncounters;

declare abstract class AnyCombatEncounters extends CombatEncounters {
  constructor(...args: never);
}
