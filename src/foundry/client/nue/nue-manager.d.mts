/**
 * Responsible for managing the New User Experience workflows.
 */
declare class NewUserExperienceManager {
  constructor();

  /**
   * Initialize the new user experience.
   * Currently, this generates some chat messages with hints for getting started if we detect this is a new world.
   */
  initialize(): void;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _createInitialChatMessages(): never;

  /**
   * Create a default scene for the new world.
   * @param sceneData - Additional data to merge with the default scene
   * @returns The created default scene
   * @remarks Creates the default scene with `{keepId: true}`, will be `"NUEDEFAULTSCENE0"` unless overwritten in `sceneData`
   */
  createDefaultScene(sceneData?: Scene.UpdateData): Promise<Scene.Implementation>;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _showNewWorldTour(): never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _activateListeners(): never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _onActionLink(): never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _onTabLink(): never;

  #NewUserExperienceManager: true;
}

declare namespace NewUserExperienceManager {}

export default NewUserExperienceManager;
