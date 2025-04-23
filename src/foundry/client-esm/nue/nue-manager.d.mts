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
}

declare namespace NewUserExperienceManager {}

export default NewUserExperienceManager;
